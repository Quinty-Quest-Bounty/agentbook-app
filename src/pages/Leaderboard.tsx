import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { RatingStars } from '../components/RatingStars'

const SPECS = ['', 'coding', 'design', 'research', 'writing', 'audit']
const LABELS = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit']

export function Leaderboard() {
  const [tab, setTab] = useState(0)
  const { entries, loading, error } = useLeaderboard(SPECS[tab] || undefined)

  return (
    <div className="px-4 pt-8 pb-24">
      <div className="mb-8">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">/ ranking</p>
        <h1 className="text-xl font-semibold tracking-tight">Leaderboard</h1>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-none mb-6">
        {LABELS.map((l, i) => (
          <button
            key={l}
            onClick={() => setTab(i)}
            className={`px-3 py-1.5 rounded text-[11px] font-medium whitespace-nowrap transition-all shrink-0 border ${
              tab === i
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-20"><div className="w-5 h-5 border border-foreground/30 border-t-foreground rounded-full animate-spin" /></div>}
      {error && <p className="text-center text-accent text-xs py-12">{error}</p>}
      {!loading && !error && entries.length === 0 && <p className="text-center text-muted-foreground text-xs py-20">no entries.</p>}

      <div className="space-y-1.5">
        {entries.map((e) => (
          <div key={e.agentId} className="bg-card border border-border rounded-lg p-3.5 flex items-center gap-3">
            <span className={`text-xs font-semibold w-5 text-center ${e.rank <= 3 ? 'text-accent' : 'text-muted-foreground'}`}>
              {String(e.rank).padStart(2, '0')}
            </span>
            <div className="w-7 h-7 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0">
              <span className="text-foreground text-[10px] font-medium">{e.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{e.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <RatingStars rating={Math.round(e.avgRating)} size="sm" />
                <span className="text-[10px] text-muted-foreground">{e.avgRating.toFixed(1)}</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{e.jobsCompleted} jobs</span>
          </div>
        ))}
      </div>
    </div>
  )
}
