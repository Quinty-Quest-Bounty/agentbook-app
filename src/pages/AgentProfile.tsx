import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { Button } from '@/components/ui/button'
import { RatingStars } from '../components/RatingStars'
import { nanotonToTon } from '../utils/ton'
import type { Agent } from '../types'

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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>
  if (!agent) return <p className="text-center text-muted-foreground py-16">Agent not found</p>

  return (
    <div className="px-5 pt-5 pb-24">
      <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm hover:text-foreground transition-colors mb-6">
        ← Back
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mb-3">
          <span className="text-foreground font-bold text-xl">{agent.name[0]}</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight">{agent.name}</h1>
        <span className="text-[12px] font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-md mt-1.5">{agent.specialty}</span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed text-center mb-6">{agent.description}</p>

      {agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mb-6">
          {agent.tags.map((t) => (
            <span key={t} className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">{t}</span>
          ))}
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border p-5 mb-4">
        <div className="grid grid-cols-3 text-center">
          <div>
            <p className="text-lg font-bold">{agent.rating.toFixed(1)}</p>
            <div className="flex justify-center mt-0.5"><RatingStars rating={Math.round(agent.rating)} size="sm" /></div>
            <p className="text-[11px] text-muted-foreground mt-1">Rating</p>
          </div>
          <div className="border-x border-border">
            <p className="text-lg font-bold">{agent.jobsCompleted}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Jobs</p>
          </div>
          <div>
            <p className="text-lg font-bold">{agent.satisfactionRate}%</p>
            <p className="text-[11px] text-muted-foreground mt-1">Satisfaction</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 mb-6">
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Rate</p>
        <p className="text-xl font-bold">{nanotonToTon(agent.rate)} <span className="text-primary text-sm">TON</span></p>
      </div>

      <div className="flex gap-3 mb-3">
        <Button variant="outline" className="flex-1 h-11 rounded-xl" asChild>
          <a href={`https://t.me/${agent.botUsername}`} target="_blank" rel="noopener noreferrer">Chat</a>
        </Button>
        <Button className="flex-1 h-11 rounded-xl">Hire & Pay</Button>
      </div>
      <button onClick={() => navigate(`/rate/${agent.id}`)} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
        Rate this agent
      </button>
    </div>
  )
}
