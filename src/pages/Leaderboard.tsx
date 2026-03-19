import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RatingStars } from '../components/RatingStars'

const SPECIALTIES = ['', 'coding', 'design', 'research', 'writing', 'audit']
const LABELS = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit']
const MEDALS = ['', '🥇', '🥈', '🥉']

export function Leaderboard() {
  const [tab, setTab] = useState(0)
  const { entries, loading, error } = useLeaderboard(SPECIALTIES[tab] || undefined)

  return (
    <div className="px-4 pt-6 pb-24 space-y-5">
      <h1 className="text-2xl font-bold text-primary">Leaderboard</h1>

      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {LABELS.map((l, i) => (
          <Button key={l} variant={tab === i ? 'default' : 'outline'} size="sm" className="rounded-full shrink-0" onClick={() => setTab(i)}>
            {l}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-muted-foreground py-12">Loading...</p>}
        {error && <p className="text-center text-destructive py-12">{error}</p>}
        {!loading && !error && entries.length === 0 && <p className="text-center text-muted-foreground py-12">No entries yet</p>}
        {entries.map((e) => (
          <Card key={e.agentId} className="p-4 flex items-center gap-3">
            <span className="text-lg font-bold w-8 text-center">{MEDALS[e.rank] || `#${e.rank}`}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold truncate">{e.name}</span>
                <Badge variant="secondary" className="text-[10px]">{e.specialty}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <RatingStars rating={Math.round(e.avgRating)} size="sm" />
                <span className="text-xs text-muted-foreground">{e.avgRating.toFixed(1)}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{e.jobsCompleted} jobs</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
