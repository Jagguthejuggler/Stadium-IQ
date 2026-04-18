import { useState, useEffect } from 'react';
import CrowdHeatmap from '../components/CrowdHeatmap';
import SmartAssistant from '../components/SmartAssistant';
import FoodOrder from '../components/FoodOrder';
import Navigation from '../components/Navigation';
import { generateMockCrowdData } from '../services/crowdData';

export default function FanDashboard() {
  const [crowdData, setCrowdData] = useState(null);

  useEffect(() => {
    const fetchRealtimeData = () => {
      setCrowdData(generateMockCrowdData());
    };
    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Massive Hero Header */}
        <header className="relative w-full rounded-[2.5rem] overflow-hidden glass-card p-8 lg:p-14 border-t border-l border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          {/* Decorative Abstract Shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-purple-500/0 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-cyan-500/0 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left float-anim">
              <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-xs font-bold tracking-widest text-indigo-300 uppercase flex items-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-ping"></span> Live Matchday Mode
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                Stadium<span className="gradient-text">IQ</span><sup className="text-2xl text-purple-400 font-bold ml-1">Lite</sup>
              </h1>
              <p className="text-lg text-slate-400 max-w-lg font-medium">
                Experience the stadium like a VIP. Avoid crowds, find the fastest routes, and order food directly to your zone.
              </p>
            </div>
            
            <div className="hidden lg:block relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700 ease-in-out"></div>
              <div className="relative w-32 h-32 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center p-6 shadow-2xl">
                 <svg className="w-full h-full text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
              </div>
            </div>
          </div>
        </header>

        <section>
          <CrowdHeatmap crowdData={crowdData} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="flex flex-col space-y-10">
            <SmartAssistant crowdData={crowdData} />
            <Navigation crowdData={crowdData} />
          </div>

          <div className="h-full">
            <FoodOrder crowdData={crowdData} />
          </div>

        </div>
      </div>
    </div>
  );
}
