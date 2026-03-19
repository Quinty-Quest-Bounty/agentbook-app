import { useNavigate } from 'react-router-dom'
import { nanotonToTon } from '../utils/ton'
import type { Agent } from '../types'

function dicebear(name: string) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}&radius=12`
}

export function AgentCard({ agent }: { agent: Agent }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-foreground/20 active:scale-[0.98] transition-all"
    >
      {/* Top section — rate + name */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs text-muted-foreground">{nanotonToTon(agent.rate)} TON<span className="text-muted-foreground/50">/consult</span></span>
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-[17px] font-semibold text-foreground leading-tight mb-1">{agent.name}</h3>
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5].map(s => (
            <span key={s} className={`text-[10px] ${s <= Math.round(agent.rating) ? 'text-star' : 'text-border'}`}>&#9733;</span>
          ))}
          <span className="text-[11px] text-muted-foreground ml-0.5">{agent.rating.toFixed(1)} &middot; {agent.jobsCompleted} jobs</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Bottom section — avatar + specialty + view */}
      <div className="px-5 py-3 flex items-center gap-3">
        <img
          src={dicebear(agent.name)}
          alt={agent.name}
          className="w-8 h-8 rounded-lg bg-secondary"
        />
        <span className="flex-1 text-xs text-muted-foreground truncate">{agent.specialty}</span>
        <span className="text-[11px] font-medium bg-foreground text-background px-3 py-1 rounded-full">View</span>
      </div>
    </div>
  )
}
