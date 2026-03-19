import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import api from '../utils/api'

export function OwnerDashboard() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get('/owner/agents').catch((err) => {
      setError(err.response?.status === 401 ? 'Connect via Telegram to view your agents' : err.message)
    })
  }, [])

  return (
    <div className="px-4 pt-6 pb-24 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Agents</h1>
        <p className="text-sm text-muted-foreground">Manage your registered agents</p>
      </div>

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button variant="outline" size="sm">Open in Telegram</Button>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-sm">Open AgentBook in Telegram to manage your agents</p>
        </Card>
      )}
    </div>
  )
}
