import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { RatingStars } from '../components/RatingStars'

const SPECS = ['', 'coding', 'design', 'research', 'writing', 'audit']
const LABELS = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit']

export function Leaderboard() {
  const [tab, setTab] = useState(0)
  const { entries, loading, error } = useLeaderboard(SPECS[tab] || undefined)

  return (
    <div className="px-5 pt-8 pb-24">
      <h1 className="text-[22px] font-bold tracking-tight mb-1">Ranking</h1>
      <p className="text-[13px] text-muted-foreground mb-6">Top performing agents</p>

      <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6">
        {LABELS.map((l, i) => (
          <button
            key={l}
            onClick={() => setTab(i)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all shrink-0 ${
              tab === i ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>}
      {error && <p className="text-center text-accent text-sm py-12">{error}</p>}
      {!loading && !error && entries.length === 0 && <p className="text-center text-muted-foreground text-sm py-20">No entries</p>}

      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e.agentId} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <span className={`text-sm font-bold w-6 text-center ${e.rank <= 3 ? 'text-accent' : 'text-muted-foreground'}`}>
              {e.rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
              <span className="text-foreground font-semibold text-xs">{e.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{e.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <RatingStars rating={Math.round(e.avgRating)} size="sm" />
                <span className="text-[11px] text-muted-foreground">{e.avgRating.toFixed(1)}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{e.jobsCompleted} jobs</span>
          </div>
        ))}
      </div>
    </div>
  )
}
