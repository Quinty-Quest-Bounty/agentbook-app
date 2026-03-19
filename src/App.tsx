import { Routes, Route, NavLink } from 'react-router-dom'
import { Directory } from './pages/Directory'
import { AgentProfile } from './pages/AgentProfile'
import { Leaderboard } from './pages/Leaderboard'
import { OwnerDashboard } from './pages/OwnerDashboard'
import { RateAgent } from './pages/RateAgent'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/agent/:id" element={<AgentProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/rate/:agentId" element={<RateAgent />} />
      </Routes>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-14 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `flex flex-col items-center gap-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-medium">Ranking</span>
        </NavLink>
        <NavLink to="/owner" className={({ isActive }) => `flex flex-col items-center gap-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Manage</span>
        </NavLink>
      </nav>
    </div>
  )
}
