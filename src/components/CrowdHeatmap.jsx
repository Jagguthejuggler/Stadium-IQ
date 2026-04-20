import { useMemo, useState, useEffect } from 'react';
import { predictCrowdDensity } from '../services/cloudFunction';

export default function CrowdHeatmap({ crowdData }) {
  const [predictions, setPredictions] = useState({});
  
  const getColors = (level) => {
    switch(level) {
      case 'LOW': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-500', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
      case 'MEDIUM': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', bar: 'bg-amber-500', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' };
      case 'HIGH': return { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400', bar: 'bg-rose-500', shadow: 'shadow-[0_0_15px_rgba(225,29,72,0.4)]' };
      default: return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', bar: 'bg-slate-600', shadow: '' };
    }
  };

  const zones = useMemo(() => {
    if (!crowdData) return [];
    return [
      ...Object.entries(crowdData.gates || {}).map(([name, level]) => ({ name, level, type: 'Gate' })),
      ...Object.entries(crowdData.facilities || {}).map(([name, level]) => ({ name, level, type: 'Facility' })),
      ...Object.entries(crowdData.foodStalls || {}).map(([name, level]) => ({ name, level, type: 'Stall' })),
    ];
  }, [crowdData]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const newPredictions = {};
      for (const zone of zones) {
        const density = zone.level === 'LOW' ? 25 : zone.level === 'MEDIUM' ? 60 : 95;
        const pred = await predictCrowdDensity(zone.name, density);
        if (pred) {
          newPredictions[zone.name] = pred;
        }
      }
      setPredictions(newPredictions);
    };
    
    if (zones.length > 0) {
      fetchPredictions();
    }
  }, [zones]);

  if (!crowdData) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Establishing Connection to Grid...</div>;

  return (
    <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
         <div>
           <h2 className="text-3xl font-black tracking-tight text-white flex items-center mb-2">
             Sector Heatmap
           </h2>
           <p className="text-slate-400 font-medium">Real-time telemetry showing live cluster formations + ML predictions.</p>
         </div>
         
         <div className="flex space-x-2 text-[0.65rem] font-black tracking-widest uppercase mt-6 md:mt-0 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50 backdrop-blur-md">
           <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optimal</span>
           <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">Elevated</span>
           <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">Critical</span>
         </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {zones.map((zone, idx) => {
          const colors = getColors(zone.level);
          const width = zone.level === 'LOW' ? '25%' : zone.level === 'MEDIUM' ? '60%' : '95%';
          const prediction = predictions[zone.name];

          return (
            <div key={idx} className={`relative overflow-hidden group rounded-2xl ${colors.bg} border ${colors.border} p-5 hover:bg-slate-800 transition-all duration-300`}>
              
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <span className="text-[0.60rem] text-slate-400 font-black uppercase tracking-widest mb-1 block">{zone.type}</span>
                   <h3 className="font-extrabold text-white text-xl tracking-tight">{zone.name}</h3>
                 </div>
                 {zone.level === 'HIGH' && (
                   <span className="flex h-3 w-3 relative">
                     <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.bar} opacity-75`}></span>
                     <span className={`relative inline-flex rounded-full h-3 w-3 ${colors.bar} ${colors.shadow}`}></span>
                   </span>
                 )}
              </div>

              <div className="w-full bg-slate-900/80 rounded-full h-2.5 mb-2 border border-slate-700/50 overflow-hidden">
                <div className={`h-2.5 rounded-full ${colors.bar} ${colors.shadow} transition-all duration-1000 ease-out`} style={{width}}></div>
              </div>
              
              <div className="text-right mb-3">
                <span className={`text-[0.65rem] font-black uppercase tracking-widest ${colors.text}`}>
                  {zone.level} Load
                </span>
              </div>

              {prediction && (
                <div className="border-t border-slate-700/50 pt-2 mt-2">
                  <span className="text-[0.60rem] text-slate-500 font-bold uppercase">📊 Prediction</span>
                  <div className="text-xs font-bold text-blue-300 mt-1">
                    {prediction.alert} • {Math.round(prediction.predictedDensity)}%
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}