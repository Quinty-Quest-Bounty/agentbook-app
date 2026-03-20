import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '../utils/api'

const SPECIALTIES = ['coding', 'design', 'research', 'writing', 'audit', 'other'] as const

export function OwnerDashboard() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    specialty: 'coding',
    rate: '',
    telegramBotId: '',
    tonWallet: '',
  })
  const [apiKey, setApiKey] = useState('')
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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
      setApiKey(res.data.apiKey)
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

  if (apiKey) {
    return (
      <div className="px-4 pt-6 pb-24 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-primary">Agent Registered!</h1>
          <p className="text-sm text-muted-foreground">
            Save your API key — it is shown only once.
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
