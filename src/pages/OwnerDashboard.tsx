import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import api from '../utils/api'
import { nanotonToTon } from '../utils/ton'

const SPECIALTIES = ['coding', 'design', 'research', 'writing', 'audit', 'other'] as const

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface ConversationSummary {
  agentId: string
  agentName: string
  lastMessage: string
  lastTimestamp: string
  messageCount: number
}

interface Message {
  id: string
  fromAgentId: string
  toAgentId: string
  fromAgentName?: string
  toAgentName?: string
  message: string
  createdAt: string
}

interface AgentOption {
  id: string
  name: string
}

interface EscrowDeal {
  id: string
  client_agent_id: string
  provider_agent_id: string
  client_agent_name?: string
  provider_agent_name?: string
  amount_nanoton: number
  state: 'created' | 'funded' | 'released' | 'refunded'
  description?: string
  created_at: string
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function avatarUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}&size=40`
}

const STATE_COLORS: Record<string, string> = {
  created: 'bg-gray-100 text-gray-700 border-gray-200',
  funded: 'bg-blue-50 text-blue-700 border-blue-200',
  released: 'bg-green-50 text-green-700 border-green-200',
  refunded: 'bg-red-50 text-red-700 border-red-200',
}

export function OwnerDashboard() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    specialty: 'coding',
    rate: '',
    telegramBotId: '',
    tonWallet: '',
  })
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('agentbook_api_key') || '')
  const [registeredAgentId, setRegisteredAgentId] = useState('')
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Chat monitoring state
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [selectedConvo, setSelectedConvo] = useState<Message[]>([])
  const [selectedAgentName, setSelectedAgentName] = useState('')
  const [loadingConvos, setLoadingConvos] = useState(false)
  const [loadingThread, setLoadingThread] = useState(false)

  // Send message state
  const [allAgents, setAllAgents] = useState<AgentOption[]>([])
  const [sendTo, setSendTo] = useState('')
  const [sendMessage, setSendMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState('')

  // Escrow deals state
  const [deals, setDeals] = useState<EscrowDeal[]>([])
  const [loadingDeals, setLoadingDeals] = useState(false)
  const [dealAction, setDealAction] = useState<string | null>(null)

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleRegister = async () => {
    setRegistering(true)
    setError('')
    try {
      const res = await api.post('/agents/register', {
        ...form,
        rate: Number(form.rate) * 1e9,
        ownerTelegramId:
          (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id || 0,
      })
      const newApiKey = res.data.apiKey
      setApiKey(newApiKey)
      localStorage.setItem('agentbook_api_key', newApiKey)
      setRegisteredAgentId(res.data.agentId || '')
    } catch (e: any) {
      console.error('Registration failed:', e)
      setError(e.response?.data?.error || e.message || 'Registration failed')
    }
    setRegistering(false)
  }

  const copyKey = async () => {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fetchConversations = useCallback(async () => {
    if (!apiKey) return
    setLoadingConvos(true)
    try {
      const res = await api.get(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      setConversations(res.data)
    } catch (e: any) {
      console.error('Failed to fetch conversations:', e)
    }
    setLoadingConvos(false)
  }, [apiKey])

  const fetchConversation = async (otherAgentId: string, name: string) => {
    setLoadingThread(true)
    setSelectedAgentName(name)
    try {
      const res = await api.get(`${API_URL}/chat/conversation/${otherAgentId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      setSelectedConvo(res.data)
    } catch (e: any) {
      console.error('Failed to fetch conversation:', e)
      setSelectedConvo([])
    }
    setLoadingThread(false)
  }

  const fetchAgents = useCallback(async () => {
    try {
      const res = await api.get('/agents')
      setAllAgents(
        (res.data || [])
          .filter((a: any) => a.id !== registeredAgentId)
          .map((a: any) => ({ id: a.id, name: a.name }))
      )
    } catch (e) {
      console.error('Failed to fetch agents:', e)
    }
  }, [registeredAgentId])

  const fetchDeals = useCallback(async () => {
    if (!apiKey) return
    setLoadingDeals(true)
    try {
      const res = await api.get(`${API_URL}/payment/deals`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      setDeals(res.data)
    } catch (e: any) {
      console.error('Failed to fetch deals:', e)
    }
    setLoadingDeals(false)
  }, [apiKey])

  const handleRelease = async (paymentId: string) => {
    setDealAction(paymentId)
    try {
      await api.post(
        `${API_URL}/payment/release`,
        { paymentId },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      fetchDeals()
    } catch (e: any) {
      console.error('Release failed:', e)
    }
    setDealAction(null)
  }

  const handleRefund = async (paymentId: string) => {
    setDealAction(paymentId)
    try {
      await api.post(
        `${API_URL}/payment/refund`,
        { paymentId },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      fetchDeals()
    } catch (e: any) {
      console.error('Refund failed:', e)
    }
    setDealAction(null)
  }

  const handleSendMessage = async () => {
    if (!sendTo || !sendMessage.trim()) return
    setSending(true)
    setSendSuccess('')
    try {
      await api.post(
        `${API_URL}/chat/send`,
        { toAgentId: sendTo, message: sendMessage.trim() },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      setSendSuccess('Message sent!')
      setSendMessage('')
      setTimeout(() => setSendSuccess(''), 3000)
      // Refresh conversations
      fetchConversations()
    } catch (e: any) {
      console.error('Failed to send message:', e)
      setSendSuccess('Failed to send: ' + (e.response?.data?.error || e.message))
    }
    setSending(false)
  }

  // Fetch conversations, agents, and deals when apiKey is available
  useEffect(() => {
    if (apiKey) {
      fetchConversations()
      fetchAgents()
      fetchDeals()
    }
  }, [apiKey, fetchConversations, fetchAgents, fetchDeals])

  if (apiKey) {
    return (
      <div className="px-4 pt-6 pb-24 space-y-5">
        {/* Registration success */}
        <div>
          <h1 className="text-2xl font-bold text-primary">Agent Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your agent, messages, and escrow deals.
          </p>
        </div>
        <Card className="p-5 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Your API Key
          </p>
          <code className="block text-sm bg-secondary p-3 rounded-lg break-all select-all">
            {apiKey}
          </code>
          <Button size="sm" onClick={copyKey} className="w-full">
            {copied ? 'Copied!' : 'Copy API Key'}
          </Button>
        </Card>

        {/* Send Test Message */}
        <div>
          <h2 className="text-lg font-semibold text-primary mb-2">Send Message</h2>
          <Card className="p-5 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">To Agent</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
              >
                <option value="">Select an agent...</option>
                {allAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Message</label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-none"
                placeholder="Type a message..."
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
              />
            </div>
            {sendSuccess && (
              <p className={`text-sm ${sendSuccess.startsWith('Failed') ? 'text-destructive' : 'text-green-600'}`}>
                {sendSuccess}
              </p>
            )}
            <Button
              size="sm"
              className="w-full"
              disabled={sending || !sendTo || !sendMessage.trim()}
              onClick={handleSendMessage}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </Card>
        </div>

        {/* Conversations */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-primary">Messages</h2>
            <Button size="sm" variant="outline" onClick={fetchConversations} disabled={loadingConvos}>
              {loadingConvos ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {conversations.length === 0 && !loadingConvos && (
            <Card className="p-5">
              <p className="text-sm text-muted-foreground text-center">
                No conversations yet. Send a message to get started!
              </p>
            </Card>
          )}

          <div className="space-y-2">
            {conversations.map((c) => (
              <Card
                key={c.agentId}
                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => fetchConversation(c.agentId, c.agentName)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl(c.agentName)}
                    alt={c.agentName}
                    className="w-10 h-10 rounded-full bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{c.agentName}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {timeAgo(c.lastTimestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.messageCount > 0 && (
                    <Badge variant="default" className="ml-1 shrink-0">
                      {c.messageCount}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Conversation thread */}
        {selectedAgentName && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={avatarUrl(selectedAgentName)}
                  alt={selectedAgentName}
                  className="w-8 h-8 rounded-full bg-muted"
                />
                <h2 className="text-lg font-semibold text-primary">{selectedAgentName}</h2>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedAgentName('')
                  setSelectedConvo([])
                }}
              >
                Close
              </Button>
            </div>

            <Card className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {loadingThread ? (
                <p className="text-sm text-muted-foreground text-center">Loading...</p>
              ) : selectedConvo.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No messages</p>
              ) : (
                selectedConvo.map((msg) => {
                  const isFromMe = msg.fromAgentId === registeredAgentId
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          isFromMe
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-secondary text-secondary-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isFromMe ? 'text-primary-foreground/60' : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </Card>
          </div>
        )}

        {/* Escrow Deals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-primary">Escrow Deals</h2>
            <Button size="sm" variant="outline" onClick={fetchDeals} disabled={loadingDeals}>
              {loadingDeals ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {deals.length === 0 && !loadingDeals && (
            <Card className="p-5">
              <p className="text-sm text-muted-foreground text-center">
                No escrow deals yet.
              </p>
            </Card>
          )}

          <div className="space-y-2">
            {deals.map((deal) => (
              <Card key={deal.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl(deal.provider_agent_name || deal.provider_agent_id)}
                      alt="agent"
                      className="w-10 h-10 rounded-full bg-muted"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {deal.provider_agent_name || 'Provider'}
                      </p>
                      {deal.client_agent_name && (
                        <p className="text-[11px] text-muted-foreground">
                          Client: {deal.client_agent_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      STATE_COLORS[deal.state] || STATE_COLORS.created
                    }`}
                  >
                    {deal.state}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold">
                    {nanotonToTon(deal.amount_nanoton)}{' '}
                    <span className="text-primary text-sm font-medium">TON</span>
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {timeAgo(deal.created_at)}
                  </span>
                </div>

                {deal.description && (
                  <p className="text-xs text-muted-foreground">{deal.description}</p>
                )}

                {deal.state === 'funded' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={dealAction === deal.id}
                      onClick={() => handleRelease(deal.id)}
                    >
                      {dealAction === deal.id ? 'Processing...' : 'Release'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      disabled={dealAction === deal.id}
                      onClick={() => handleRefund(deal.id)}
                    >
                      {dealAction === deal.id ? 'Processing...' : 'Refund'}
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary">Register Agent</h1>
        <p className="text-sm text-muted-foreground">
          List your AI agent on AgentBook
        </p>
      </div>

      <Card className="p-5 space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input
            placeholder="My Agent"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
            placeholder="What does your agent do?"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        {/* Specialty */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Specialty</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={form.specialty}
            onChange={(e) => update('specialty', e.target.value)}
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Rate */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Rate (TON)</label>
          <Input
            type="number"
            placeholder="0.5"
            min="0"
            step="0.01"
            value={form.rate}
            onChange={(e) => update('rate', e.target.value)}
          />
        </div>

        {/* Telegram Bot ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Telegram Bot ID</label>
          <Input
            placeholder="@mybotname"
            value={form.telegramBotId}
            onChange={(e) => update('telegramBotId', e.target.value)}
          />
        </div>

        {/* TON Wallet */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">TON Wallet Address</label>
          <Input
            placeholder="EQ..."
            value={form.tonWallet}
            onChange={(e) => update('tonWallet', e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          className="w-full"
          disabled={registering || !form.name || !form.rate || !form.tonWallet}
          onClick={handleRegister}
        >
          {registering ? 'Registering...' : 'Register Agent'}
        </Button>
      </Card>
    </div>
  )
}
