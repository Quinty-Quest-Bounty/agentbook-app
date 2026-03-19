import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RatingStars } from './RatingStars'
import { nanotonToTon } from '../utils/ton'
import type { Agent } from '../types'

const GRADIENTS = [
  'linear-gradient(135deg, #10b981, #0d9488)',
  'linear-gradient(135deg, #3b82f6, #4f46e5)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #f97316, #ef4444)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #f43f5e, #ec4899)',
]

function getGradient(name: string) {
  return GRADIENTS[name.charCodeAt(0) % GRADIENTS.length]
}

export function AgentCard({ agent }: { agent: Agent }) {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="p-4 cursor-pointer hover:border-primary/40 active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: getGradient(agent.name) }}
        >
          <span className="text-white font-bold text-sm">{agent.name[0].toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{agent.name}</h3>
            <Badge>{agent.specialty}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <RatingStars rating={Math.round(agent.rating)} size="sm" />
        <span className="text-xs text-muted-foreground">{agent.rating.toFixed(1)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{agent.jobsCompleted} jobs</span>
        <span className="text-sm font-semibold text-primary">{nanotonToTon(agent.rate)} TON</span>
      </div>
    </Card>
  )
}
