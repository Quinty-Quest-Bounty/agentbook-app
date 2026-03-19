import { useNavigate } from 'react-router-dom'
import { RatingStars } from './RatingStars'
import { nanotonToTon } from '../utils/ton'
import type { Agent } from '../types'

export function AgentCard({ agent }: { agent: Agent }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-foreground/25 active:scale-[0.99] transition-all"
    >
      {/* Top row: number label + icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-secondary border border-border flex items-center justify-center">
            <span className="text-foreground text-xs font-medium">{agent.name[0]}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground leading-tight">{agent.name}</h3>
            <span className="text-[11px] text-muted-foreground">{agent.specialty}</span>
          </div>
        </div>
        <span className="text-[10px] font-medium text-primary border border-primary/30 bg-primary/5 px-2 py-0.5 rounded">{agent.specialty}</span>
      </div>

      {/* Stats row */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <RatingStars rating={Math.round(agent.rating)} size="sm" />
            <span className="text-[11px] text-muted-foreground">{agent.rating.toFixed(1)}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{agent.jobsCompleted} completed</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold text-foreground">{nanotonToTon(agent.rate)}</span>
          <span className="text-[11px] text-primary ml-1">TON</span>
        </div>
      </div>
    </div>
  )
}
