import { useState } from 'react';
import { recommendRoute } from '../services/decisionEngine';

export default function Navigation({ crowdData }) {
  const [seat, setSeat] = useState("");
  const [route, setRoute] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleNavigate = (e) => {
    e.preventDefault();
    const result = recommendRoute(crowdData, seat);
    setRoute(result);
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 lg:p-10 border-x border-b border-t border-teal-500/20 group hover:border-teal-500/50 transition-colors duration-500 relative overflow-hidden">
      {/* Subdued map target visual */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
         <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="20" stroke="#14b8a6" strokeWidth="2" />
            <circle cx="50" cy="50" r="4" fill="#14b8a6" />
            <path d="M50 0V20M50 80V100M0 50H20M80 50H100" stroke="#14b8a6" strokeWidth="2" />
         </svg>
      </div>

      <h2 className="text-3xl font-black mb-2 flex items-center relative z-10 tracking-tight text-white">
        Coordinate Router
      </h2>
      <p className="text-slate-400 text-base mb-8 font-medium relative z-10 max-w-sm">Punch in your ticket block to bypass congested arteries.</p>

      <form onSubmit={handleNavigate} className="flex flex-col sm:flex-row gap-4 mb-4 relative z-10">
        <input
          type="text"
          aria-label="Enter seat number"
          placeholder="Block (e.g., M-42)"
          className="flex-grow bg-slate-900/80 border border-slate-700/80 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-white rounded-2xl px-6 py-5 focus:outline-none transition-all placeholder-slate-600 font-black text-xl tracking-widest uppercase shadow-inner"
          value={seat}
          onChange={(e) => setSeat(e.target.value.toUpperCase())}
          required
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-black text-lg uppercase tracking-widest py-5 px-8 rounded-2xl shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transform hover:-translate-y-1 transition-all duration-300"
        >
          Plot
        </button>
      </form>

      {route ? (
        <div role="status" className="bg-teal-500/10 p-6 rounded-2xl border border-teal-500/40 animate-entrance relative z-10 backdrop-blur-md mt-8">
          <div className="absolute left-0 top-0 w-2 h-full bg-teal-400 rounded-l-2xl shadow-[0_0_15px_rgba(45,212,191,1)] animate-pulse"></div>
          <div className="flex flex-col mb-4 pl-2">
             <span className="text-[0.65rem] uppercase text-teal-400 tracking-widest font-black mb-1">Waypoint Navigated</span>
             <span className="text-4xl font-black text-white tracking-tighter">{route.recommendation}</span>
          </div>
          <div className="flex border-t border-teal-500/30 pt-4 pl-2 text-sm text-teal-100 font-bold">
             <svg className="w-5 h-5 mr-3 text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             {route.reason}
          </div>

          {/* Google Maps Button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm uppercase"
          >
            {showMap ? '🗺️ Hide Map' : '🗺️ Show Stadium Map'}
          </button>
        </div>
      ) : (
         <div className="mt-6 text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 animate-ping"></span> Grid Sleeping
         </div>
      )}

      {/* Google Maps Embed */}
      {showMap && (
        <div className="mt-6 relative z-10 rounded-2xl overflow-hidden border border-teal-500/40">
          <iframe
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen=""
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5454771874366!2d72.8479!3d19.0176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c9c9c9c9c9%3A0x1234567890!2sIPL%20Cricket%20Stadium!5e0!3m2!1sen!2sin!4v1234567890"
          ></iframe>
          <p className="text-xs text-slate-400 p-3 bg-slate-900/50">
            📍 Stadium location powered by Google Maps
          </p>
        </div>
      )}
    </div>
  );
}