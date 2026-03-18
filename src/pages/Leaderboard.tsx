import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { SpecialtyFilter } from '../components/SpecialtyFilter';

export function Leaderboard() {
  const [specialty, setSpecialty] = useState('');
  const { entries, loading, error } = useLeaderboard(specialty || undefined);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>

      <SpecialtyFilter selected={specialty} onChange={setSpecialty} />

      <div className="mt-4">
        {loading && <p className="text-center text-[var(--text-secondary)] py-8">Loading...</p>}
        {error && <p className="text-center text-[var(--danger)] py-8">{error}</p>}
        {!loading && !error && <LeaderboardTable entries={entries} />}
      </div>
    </div>
  );
}
