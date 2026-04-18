import { useState } from 'react';
import { recommendGate, recommendFoodStall, recommendRoute } from '../services/decisionEngine';

export default function SmartAssistant({ crowdData }) {
  const [purpose, setPurpose] = useState('Entry');
  const [locationOrSeat, setLocationOrSeat] = useState('');
  const [result, setResult] = useState(null);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!crowdData) return;

    let res = null;
    if (purpose === 'Entry') {
      res = recommendGate(crowdData, locationOrSeat);
    } else if (purpose === 'Food') {
      res = recommendFoodStall(crowdData, locationOrSeat);
    } else if (purpose === 'Navigation') {
      res = recommendRoute(crowdData, locationOrSeat);
    }
    setResult(res);
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 lg:p-10 relative overflow-visible border-x border-b border-t border-indigo-500/20 group hover:border-indigo-500/50 transition-colors duration-500">
      
      {/* Visual Floating Element out of the box */}
      <div className="absolute -top-10 right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center float-anim shadow-[0_20px_40px_rgba(79,70,229,0.4)] border border-white/20 z-20">
         <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>

      <h2 className="text-3xl font-black text-white mb-2 tracking-tight flex flex-col">
        <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Cortex AI</span>
        Decision Engine
      </h2>
      <p className="text-slate-400 text-base mb-10 font-medium max-w-sm">Tap into the stadium grid. Get instantaneous pathfinding and queue metrics.</p>
      
      <form onSubmit={handleAsk} className="space-y-6 relative z-10">
        <div className="group/input relative">
          <label className="absolute -top-3 left-4 bg-slate-900/90 px-2 text-[0.65rem] font-bold text-indigo-300 uppercase tracking-widest border border-slate-700 rounded-md z-10" htmlFor="purpose">Action Sequence</label>
          <select 
            id="purpose"
            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-6 py-5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none font-bold text-lg shadow-inner transition-all hover:bg-slate-800/80 cursor-pointer"
            value={purpose} 
            onChange={(e) => { setPurpose(e.target.value); setResult(null); }}
          >
            <option value="Entry">Locate Best Entry Gate</option>
            <option value="Food">Find Available Food Stall</option>
            <option value="Navigation">Navigate to Seat</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none text-indigo-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="group/input relative">
           <label className="absolute -top-3 left-4 bg-slate-900/90 px-2 text-[0.65rem] font-bold text-indigo-300 uppercase tracking-widest border border-slate-700 rounded-md z-10" htmlFor="location">
             {purpose === 'Navigation' ? 'Target Identifier' : 'User Coordinates'}
           </label>
           <input 
              id="location"
              type="text" 
              placeholder={purpose === 'Navigation' ? 'Seat (e.g., A-10)' : 'Location (e.g., North Entry)'}
              className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-6 py-5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-lg shadow-inner placeholder-slate-600 transition-all hover:bg-slate-800/80"
              value={locationOrSeat}
              onChange={(e) => setLocationOrSeat(e.target.value)}
              required
           />
        </div>

        <button 
          className="w-full relative overflow-hidden group bg-slate-800 border border-indigo-500/50 text-white font-black text-lg uppercase tracking-widest py-5 px-6 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all duration-300"
          type="submit"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10">Initialize Scan</span>
        </button>
      </form>

      {result && (
        <div role="status" className="mt-8 bg-black/40 border border-green-500/40 p-1 rounded-2xl animate-entrance">
          <div className="bg-slate-900/80 rounded-[0.9rem] p-6 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/20 blur-3xl rounded-full mix-blend-screen"></div>
            <h3 className="text-[0.65rem] uppercase tracking-widest font-black text-green-400 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span> Target Acquired
            </h3>
            
            <div className="flex flex-col mb-4">
              <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">{result.recommendation}</span>
              <div className="flex items-center space-x-3">
                 <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                   Wait Time
                 </span>
                 <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                   {result.waitTime}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-dashed border-slate-700">
               <p className="text-sm text-slate-300 font-medium leading-relaxed flex items-start">
                  <svg className="w-5 h-5 mr-3 text-slate-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {result.reason}
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
