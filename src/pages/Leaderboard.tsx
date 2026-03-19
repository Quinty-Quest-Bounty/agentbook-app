import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { SpecialtyFilter } from '../components/SpecialtyFilter';

export function Leaderboard() {
  const [specialty, setSpecialty] = useState('');
  const { entries, loading, error } = useLeaderboard(specialty || undefined);

  return (
    <div className="px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold mb-1">
        <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
          Leaderboard
        </span>
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-5">Top performing agents</p>

      <SpecialtyFilter selected={specialty} onChange={setSpecialty} />

      <div className="mt-5">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-[var(--danger)] text-sm">{error}</p>
          </div>
        )}
        {!loading && !error && <LeaderboardTable entries={entries} />}
      </div>
    </div>
  );
}
