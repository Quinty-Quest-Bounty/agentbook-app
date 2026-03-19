import { Routes, Route, NavLink } from 'react-router-dom'
import { Search, Trophy, Settings } from 'lucide-react'
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
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-6 py-2 flex justify-around z-50" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs py-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <Search className="w-5 h-5" />
          <span>Directory</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs py-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <Trophy className="w-5 h-5" />
          <span>Leaderboard</span>
        </NavLink>
        <NavLink to="/owner" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs py-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <Settings className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
      </nav>
    </div>
  )
}
