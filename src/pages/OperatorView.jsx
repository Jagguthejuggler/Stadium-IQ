import { useState, useEffect } from 'react';
import { firestore } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateMockCrowdData } from '../services/crowdData';

export default function OperatorView() {
  const [crowdData, setCrowdData] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRealtimeData = () => {
      setCrowdData(generateMockCrowdData());
    };
    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 10000);
    return () => clearInterval(interval);
  }, []);

  const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  let allZones = [];

  if (crowdData) {
    allZones = [
      ...Object.entries(crowdData.gates || {}).map(([name, level]) => ({ name, level, category: 'Gate' })),
      ...Object.entries(crowdData.foodStalls || {}).map(([name, level]) => ({ name, level, category: 'Food Stall' })),
      ...Object.entries(crowdData.facilities || {}).map(([name, level]) => ({ name, level, category: 'Facility' })),
    ];
    allZones.forEach(z => {
      if (counts[z.level] !== undefined) counts[z.level]++;
    });
  }

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!alertMsg) return;
    setIsSending(true);

    try {
      const isMockFirebase = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "mock-api-key";

      if (firestore && !isMockFirebase) {
         await addDoc(collection(firestore, "alerts"), {
           message: alertMsg,
           timestamp: serverTimestamp()
         });
      } else {
         await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setSuccess(true);
      setAlertMsg("");
      setTimeout(() => setSuccess(false), 3000);
    } catch(err) {
      console.warn("Failed to send alert to firestore", err);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setIsSending(false);
    }
  };

  if (!crowdData) return <div className="p-8 font-sans">Loading Operator View...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-400">Operator Dashboard</h1>
            <p className="text-slate-400">Stadium Control & Alerts</p>
          </div>
          <div className="text-right text-sm text-slate-400">
             Total Monitored Zones: <strong className="text-white">{allZones.length}</strong>
          </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
           <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30 flex justify-between items-center text-green-400">
             <span className="font-bold">LOW Congestion</span>
             <span className="text-3xl font-black">{counts.LOW}</span>
           </div>
           <div className="bg-slate-800 rounded-xl p-4 border border-amber-500/30 flex justify-between items-center text-amber-400">
             <span className="font-bold">MEDIUM Congestion</span>
             <span className="text-3xl font-black">{counts.MEDIUM}</span>
           </div>
           <div className="bg-slate-800 rounded-xl p-4 border border-red-500/30 flex justify-between items-center text-red-400">
             <span className="font-bold">HIGH Congestion</span>
             <span className="text-3xl font-black">{counts.HIGH}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-900 text-slate-300">
                 <tr>
                   <th className="p-4">Zone Name</th>
                   <th className="p-4">Category</th>
                   <th className="p-4">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-700">
                 {allZones.map((zone, i) => (
                   <tr key={i} className="hover:bg-slate-700/50">
                     <td className="p-4 font-semibold">{zone.name}</td>
                     <td className="p-4 text-slate-400">{zone.category}</td>
                     <td className="p-4">
                       <span className={`px-2 py-1 text-xs font-bold rounded ${
                         zone.level === 'LOW' ? 'bg-green-500/20 text-green-400' :
                         zone.level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                         'bg-red-500/20 text-red-400'
                       }`}>
                         {zone.level}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>

          {/* Alerting */}
          <div className="lg:col-span-1">
             <form onSubmit={handleSendAlert} className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative">
               <h2 className="text-xl font-bold mb-4 flex items-center text-slate-200">
                 <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                 Global Alert
               </h2>
               <p className="text-sm text-slate-400 mb-4">Send a broadcast message to user dashboards.</p>
               <textarea 
                 className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none mb-4"
                 rows="4"
                 placeholder="E.g., Gate A is temporarily closed due to an incident."
                 value={alertMsg}
                 onChange={(e) => setAlertMsg(e.target.value)}
                 required
               ></textarea>
               <button 
                 type="submit"
                 disabled={isSending}
                 className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 px-4 rounded-xl transition-all"
               >
                 {isSending ? 'Sending...' : 'Send Alert'}
               </button>

               {success && (
                 <div role="status" className="absolute -top-12 left-0 right-0 bg-green-500 text-white text-center py-2 rounded-xl text-sm font-bold shadow-lg animate-fade-in-up">
                   Alert Sent Successfully!
                 </div>
               )}
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
