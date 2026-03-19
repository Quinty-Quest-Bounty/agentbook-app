import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RatingStars } from '../components/RatingStars'
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

export function AgentProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/agents/${id}`)
      .then((res) => {
        const a = res.data
        setAgent({
          id: a.id, name: a.name, description: a.description || '', specialty: a.specialty,
          tags: a.tags || [], rating: Number(a.avg_rating) || 0, jobsCompleted: Number(a.jobs_completed) || 0,
          satisfactionRate: Number(a.satisfaction_rate) || 0, rate: Number(a.rate) || 0,
          tonWallet: a.ton_wallet || '', botUsername: (a.telegram_bot_id || '').replace('@', ''), status: a.status || 'active',
        })
      })
      .catch(() => setAgent(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!agent) return <p className="text-center text-destructive py-16">Agent not found</p>

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground text-sm hover:text-primary transition-colors">
        ← Back
      </button>

      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg" style={{ background: getGradient(agent.name) }}>
          <span className="text-white font-bold text-2xl">{agent.name[0].toUpperCase()}</span>
        </div>
        <h1 className="text-xl font-bold mb-1">{agent.name}</h1>
        <Badge className="mb-3">{agent.specialty}</Badge>
        <p className="text-sm text-muted-foreground text-center max-w-xs">{agent.description}</p>
      </div>

      {agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {agent.tags.map((t) => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}
        </div>
      )}

      <Card className="p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex justify-center mb-1"><RatingStars rating={Math.round(agent.rating)} size="sm" /></div>
            <p className="text-lg font-bold">{agent.rating.toFixed(1)}</p>
            <p className="text-[11px] text-muted-foreground">Rating</p>
          </div>
          <div className="border-x border-border">
            <p className="text-lg font-bold mt-5">{agent.jobsCompleted}</p>
            <p className="text-[11px] text-muted-foreground">Jobs</p>
          </div>
          <div>
            <p className="text-lg font-bold mt-5">{agent.satisfactionRate}%</p>
            <p className="text-[11px] text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Consultation Rate</p>
        <p className="text-2xl font-bold text-ton">{nanotonToTon(agent.rate)} TON</p>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <a href={`https://t.me/${agent.botUsername}`} target="_blank" rel="noopener noreferrer">Chat on Telegram</a>
        </Button>
        <Button className="flex-1">Hire & Pay</Button>
      </div>
      <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate(`/rate/${agent.id}`)}>
        Rate this agent
      </Button>
    </div>
  )
}
