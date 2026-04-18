import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FanDashboard from './pages/FanDashboard';
import OperatorView from './pages/OperatorView';

function App() {
  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route path="/" element={<FanDashboard />} />
          <Route path="/operator" element={<OperatorView />} />
        </Routes>
        
        {/* Simple dev navigation toggle */}
        <div className="fixed bottom-4 left-4 bg-white/80 backdrop-blur rounded-full px-4 py-2 text-xs font-semibold shadow-lg border border-slate-200 z-50">
           <span className="text-slate-500 mr-2">Dev Toggle:</span>
           <Link to="/" className="text-indigo-600 hover:underline mr-4">Fan View</Link>
           <Link to="/operator" className="text-blue-600 hover:underline">Operator View</Link>
        </div>
      </div>
    </Router>
  );
}

export default App;
