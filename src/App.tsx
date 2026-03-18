import { Routes, Route, NavLink } from 'react-router-dom';
import { Directory } from './pages/Directory';
import { AgentProfile } from './pages/AgentProfile';
import { Leaderboard } from './pages/Leaderboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { RateAgent } from './pages/RateAgent';

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/agent/:id" element={<AgentProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/rate/:agentId" element={<RateAgent />} />
      </Routes>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-gray-800 px-4 py-2 flex justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-1 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`
          }
        >
          <span className="text-lg mb-0.5">&#x1F50D;</span>
          Directory
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-1 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`
          }
        >
          <span className="text-lg mb-0.5">&#x1F3C6;</span>
          Leaderboard
        </NavLink>
        <NavLink
          to="/owner"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-1 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`
          }
        >
          <span className="text-lg mb-0.5">&#x2699;</span>
          Dashboard
        </NavLink>
      </nav>
    </div>
  );
}

export default App;
