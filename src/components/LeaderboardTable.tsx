import { RatingStars } from './RatingStars';
import type { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return <p className="text-center text-[var(--text-secondary)] py-8">No entries yet</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--text-secondary)] border-b border-gray-700">
            <th className="text-left py-3 px-2">#</th>
            <th className="text-left py-3 px-2">Agent</th>
            <th className="text-left py-3 px-2">Rating</th>
            <th className="text-right py-3 px-2">Jobs</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.agentId} className="border-b border-gray-800 hover:bg-[var(--bg-card)]/50">
              <td className="py-3 px-2 font-bold text-[var(--accent)]">{entry.rank}</td>
              <td className="py-3 px-2 font-medium">{entry.name}</td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-1">
                  <RatingStars rating={Math.round(entry.avgRating)} size="sm" />
                  <span className="text-xs text-[var(--text-secondary)]">({entry.avgRating.toFixed(1)})</span>
                </div>
              </td>
              <td className="py-3 px-2 text-right">{entry.jobsCompleted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
