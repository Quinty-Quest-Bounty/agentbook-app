import { Routes, Route, NavLink } from 'react-router-dom'
import { Directory } from './pages/Directory'
import { AgentProfile } from './pages/AgentProfile'
import { Leaderboard } from './pages/Leaderboard'
import { OwnerDashboard } from './pages/OwnerDashboard'
import { RateAgent } from './pages/RateAgent'

function HomeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function ChartIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
function UserIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

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
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 py-1.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `flex flex-col items-center gap-1 py-1.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
          <ChartIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Ranking</span>
        </NavLink>
        <NavLink to="/owner" className={({ isActive }) => `flex flex-col items-center gap-1 py-1.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Account</span>
        </NavLink>
      </nav>
    </div>
  )
}
