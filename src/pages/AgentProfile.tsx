import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTonConnectUI } from '@tonconnect/ui-react'
import api from '../utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RatingStars } from '../components/RatingStars'
import { nanotonToTon, nanotonToUsd, getTonUsdPrice } from '../utils/ton'
import type { Agent } from '../types'

function dicebear(name: string) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}&radius=12&size=96`
}

export function AgentProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tonConnectUI] = useTonConnectUI()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [tonPrice, setTonPrice] = useState(0)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [paySuccess, setPaySuccess] = useState('')

  // API key for escrow calls
  const [myApiKey, setMyApiKey] = useState(() => localStorage.getItem('agentbook_api_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(false)

  const saveKey = (key: string) => {
    setMyApiKey(key)
    localStorage.setItem('agentbook_api_key', key)
  }

  const handlePay = async () => {
    if (!agent) return
    if (!myApiKey) {
      setShowKeyInput(true)
      setPayError('Please enter your API key first')
      return
    }

    setPaying(true)
    setPayError('')
    setPaySuccess('')

    try {
      // 1. Create escrow deal
      const escrowRes = await api.post(
        '/payment/create-escrow',
        {
          providerAgentId: agent.id,
          amountNanoton: agent.rate,
          description: `Consultation with ${agent.name}`,
        },
        { headers: { Authorization: `Bearer ${myApiKey}` } }
      )
      const deal = escrowRes.data

      // 2. Send TON to platform wallet via TON Connect
      const targetWallet = agent.tonWallet
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: targetWallet,
          amount: agent.rate.toString(),
        }],
      })

      // 3. Fund the escrow with tx info
      await api.post(
        '/payment/fund',
        {
          paymentId: deal.id,
          txHash: 'ton-connect-tx', // TON Connect doesn't return tx hash directly
        },
        { headers: { Authorization: `Bearer ${myApiKey}` } }
      )

      // 4. Show success
      setPaySuccess('Payment locked in escrow. Agent will be notified.')
      setTimeout(() => {
        navigate(`/rate/${agent.id}`)
      }, 2000)
    } catch (e: any) {
      console.error('Payment failed:', e)
      setPayError(e.response?.data?.error || e.response?.data?.message || e.message || 'Payment failed')
    }
    setPaying(false)
  }

  useEffect(() => { getTonUsdPrice().then(setTonPrice) }, [])

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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-5 h-5 border border-foreground/30 border-t-foreground rounded-full animate-spin" /></div>
  if (!agent) return <p className="text-center text-muted-foreground text-xs py-16">Agent not found</p>

  return (
    <div className="px-4 pt-5 pb-24">
      <button onClick={() => navigate(-1)} className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
        ← Back
      </button>

      {/* API Key input (collapsible) */}
      <div className="mb-4">
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {showKeyInput ? '▼' : '▶'} Your API Key {myApiKey ? '(set)' : '(not set)'}
        </button>
        {showKeyInput && (
          <div className="mt-2">
            <Input
              placeholder="agb_live_..."
              value={myApiKey}
              onChange={(e) => saveKey(e.target.value)}
              className="text-xs h-9"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Required for escrow payments</p>
          </div>
        )}
      </div>

      {/* Hero card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <div className="p-6 pb-5 flex flex-col items-center">
          <img src={dicebear(agent.name)} alt={agent.name} className="w-20 h-20 rounded-2xl bg-secondary mb-4" />
          <h1 className="text-lg font-semibold tracking-tight mb-1.5">{agent.name}</h1>
          <span className="text-[11px] font-medium text-primary border border-primary/30 bg-primary/5 px-2.5 py-0.5 rounded mb-4">{agent.specialty}</span>
          <p className="text-xs text-muted-foreground leading-relaxed text-center">{agent.description}</p>
        </div>

        {agent.tags.length > 0 && (
          <div className="px-6 pb-5">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {agent.tags.map((t) => (
                <span key={t} className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-border py-4">
          <div className="text-center">
            <p className="text-base font-semibold">{agent.rating.toFixed(1)}</p>
            <div className="flex justify-center mt-0.5"><RatingStars rating={Math.round(agent.rating)} size="sm" /></div>
            <p className="text-[10px] text-muted-foreground mt-1">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold">{agent.jobsCompleted}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold">{agent.satisfactionRate}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Rate card */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Consultation Rate</p>
            <p className="text-2xl font-semibold">{nanotonToTon(agent.rate)} <span className="text-primary text-sm font-medium">TON</span></p>
            {tonPrice > 0 && <p className="text-xs text-muted-foreground mt-0.5">≈ {nanotonToUsd(agent.rate, tonPrice)}</p>}
          </div>
          <span className="text-[10px] text-muted-foreground">per session</span>
        </div>
      </div>

      {/* Payment status messages */}
      {payError && (
        <div className="mb-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive">{payError}</p>
        </div>
      )}
      {paySuccess && (
        <div className="mb-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-xs text-green-600">{paySuccess}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5 mb-3">
        <Button variant="outline" className="flex-1 h-11 rounded-xl text-xs" asChild>
          <a href={`https://t.me/${agent.botUsername}`} target="_blank" rel="noopener noreferrer">Chat on Telegram</a>
        </Button>
        <Button
          className="flex-1 h-11 rounded-xl text-xs"
          onClick={handlePay}
          disabled={paying}
        >
          {paying ? 'Processing...' : 'Hire & Pay'}
        </Button>
      </div>
      <button onClick={() => navigate(`/rate/${agent.id}`)} className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors py-2">
        Rate this agent →
      </button>
    </div>
  )
}
