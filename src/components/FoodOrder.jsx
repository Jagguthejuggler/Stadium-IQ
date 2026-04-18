import { useState } from 'react';
import { firestore } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const MENU_ITEMS = [
  { id: 'vada_pav', name: 'Mumbai Vada Pav', desc: 'Spicy potato slider', price: 50, img: '🍔' },
  { id: 'samosa', name: 'Crispy Samosa', desc: 'Peas & potato filling', price: 30, img: '🥟' },
  { id: 'cold_drink', name: 'Chilled Cola', desc: '500ml cooler', price: 40, img: '🥤' },
  { id: 'popcorn', name: 'Butter Popcorn', desc: 'Large Tub', price: 60, img: '🍿' }
];

export default function FoodOrder({ crowdData }) {
  const [selectedStall, setSelectedStall] = useState("Stall A");
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const getStallWaitTime = (stall) => {
    if (!crowdData || !crowdData.foodStalls) return 15;
    const level = crowdData.foodStalls[stall];
    if (level === 'LOW') return 5;
    if (level === 'MEDIUM') return 15;
    if (level === 'HIGH') return 30;
    return 15;
  };

  const handleToggleCart = (item) => {
    if (cart.find(i => i.id === item.id)) {
      setCart(cart.filter(i => i.id !== item.id));
    } else {
      setCart([...cart, item]);
    }
  };

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    const mockId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    try {
      // If we don't have a real API key in `.env`, we skip the actual network request and simulate a delay.
      const isMockFirebase = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "mock-api-key";

      if (firestore && !isMockFirebase) {
        await addDoc(collection(firestore, "orders"), {
          stall: selectedStall,
          items: cart.map(i => i.name),
          total: total,
          timestamp: serverTimestamp(),
          mockId: mockId
        });
      } else {
        // Simulate a smooth 1.5s network delay so the 'Processing...' animation shows briefly before 'Order Placed!' is resolved.
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setOrderId(mockId);
      setCart([]);
    } catch (e) {
      setOrderId(mockId);
      setCart([]);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="glass-card-light rounded-[2.5rem] p-8 lg:p-10 flex flex-col h-full relative overflow-hidden text-slate-800">
      
      {/* Dynamic Background Glow internal to light card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/40 to-pink-500/0 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>

      <h2 className="text-4xl font-black text-slate-900 mb-8 flex items-center tracking-tighter">
        Quick Eats
        <span className="ml-3 inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/30">Express</span>
      </h2>

      {orderId ? (
        <div role="status" className="bg-white border-2 border-emerald-500/30 rounded-[2rem] p-8 text-center animate-entrance my-auto shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(16,185,129,0.4)]">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Order Sent!</h3>
          <p className="text-slate-500 mb-6 font-medium">Head over to <span className="text-orange-600 font-bold">{selectedStall}</span></p>
          <div className="w-full bg-slate-50 border border-slate-200 py-4 rounded-2xl border-dashed">
            <span className="block text-xs uppercase text-slate-400 font-bold tracking-widest mb-1">Pickup ID</span>
            <span className="font-mono text-2xl font-black text-slate-900 tracking-widest">{orderId}</span>
          </div>
          <button 
            onClick={() => setOrderId(null)}
            className="mt-8 text-sm text-slate-400 hover:text-slate-600 font-bold underline decoration-2 underline-offset-4"
          >
            Start New Order
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full relative z-10">
          
          <div className="mb-6 relative">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
             </div>
             <select 
               id="stall"
               className="w-full bg-white/80 backdrop-blur border-0 ring-1 ring-slate-200 text-slate-900 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none font-bold text-lg shadow-sm transition-all hover:bg-white cursor-pointer"
               value={selectedStall} 
               onChange={(e) => setSelectedStall(e.target.value)}
             >
               {['Stall A', 'Stall B', 'Stall C', 'Stall D'].map(stall => (
                  <option key={stall} value={stall}>
                    {stall} (Est. {getStallWaitTime(stall)}m Queue)
                  </option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none text-slate-400">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </div>
          </div>

          <div className="flex-grow space-y-4 mb-8 custom-scrollbar overflow-y-auto pr-2">
            {MENU_ITEMS.map((item) => {
              const selected = cart.some(i => i.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleCart(item)}
                  className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group ${
                    selected 
                    ? 'bg-white ring-2 ring-orange-500 shadow-[0_10px_20px_rgba(249,115,22,0.15)] transform scale-[1.02]' 
                    : 'bg-white/60 hover:bg-white ring-1 ring-slate-100 hover:ring-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl shadow-inner mr-4 group-hover:scale-110 transition-transform">
                    {item.img}
                  </div>
                  
                  <div className="flex-grow text-left">
                     <h4 className="font-extrabold text-slate-900 text-lg">{item.name}</h4>
                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.desc}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                     <span className="font-black text-lg text-slate-800 mb-1">₹{item.price}</span>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                       selected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300'
                     }`}>
                       {selected && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                     </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleOrder}
            disabled={cart.length === 0 || isOrdering}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xl py-5 px-6 rounded-[1.5rem] shadow-[0_15px_30px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.4)] transform hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
          >
            <span className="tracking-tighter">{isOrdering ? 'Processing...' : 'Pay & Order'}</span>
            {!isOrdering && <span className="bg-white text-slate-900 px-4 py-1.5 rounded-xl">₹{cart.reduce((a, b) => a + b.price, 0)}</span>}
          </button>
        </div>
      )}
    </div>
  );
}
