import { useNavigate } from 'react-router-dom'
import { RatingStars } from './RatingStars'
import { nanotonToTon } from '../utils/ton'
import type { Agent } from '../types'

export function AgentCard({ agent }: { agent: Agent }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="bg-card rounded-2xl p-4 cursor-pointer border border-border hover:border-foreground/20 active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
          <span className="text-foreground font-semibold text-sm">{agent.name[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-[15px] text-foreground truncate">{agent.name}</h3>
            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">{agent.specialty}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <RatingStars rating={Math.round(agent.rating)} size="sm" />
        <span className="text-xs text-muted-foreground">{agent.rating.toFixed(1)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{agent.jobsCompleted} completed</span>
        <span className="text-sm font-semibold text-foreground">{nanotonToTon(agent.rate)} <span className="text-primary text-xs">TON</span></span>
      </div>
    </div>
  )
}
