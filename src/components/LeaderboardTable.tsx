import { RatingStars } from './RatingStars';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const RANK_STYLES: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-gray-300',
  3: 'text-amber-700',
};

const RANK_BG: Record<number, string> = {
  1: 'bg-amber-400/10 border-amber-400/20',
  2: 'bg-gray-300/10 border-gray-300/20',
  3: 'bg-amber-700/10 border-amber-700/20',
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center mb-4">
          <span className="text-2xl">🏆</span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm">No entries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const isTop3 = entry.rank <= 3;
        return (
          <div
            key={entry.agentId}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
              isTop3
                ? RANK_BG[entry.rank]
                : 'bg-[var(--bg-card)] border-[var(--card-border)]'
            }`}
          >
            {/* Rank */}
            <div className={`w-8 text-center font-bold text-lg ${isTop3 ? RANK_STYLES[entry.rank] : 'text-[var(--text-secondary)]'}`}>
              {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{entry.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <RatingStars rating={Math.round(entry.avgRating)} size="sm" />
                <span className="text-xs text-[var(--text-secondary)]">{entry.avgRating.toFixed(1)}</span>
              </div>
            </div>

            {/* Jobs */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{entry.jobsCompleted}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">jobs</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
