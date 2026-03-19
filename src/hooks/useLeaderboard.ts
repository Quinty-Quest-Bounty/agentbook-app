import { useState, useEffect } from 'react';
import api from '../utils/api';
import type { LeaderboardEntry } from '../types';

export function useLeaderboard(specialty?: string, limit = 10) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get('/reputation/leaderboard', {
        params: {
          specialty: specialty || undefined,
          limit,
        },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: LeaderboardEntry[] = data.map((a: any, i: number) => ({
          rank: i + 1,
          agentId: a.id as string,
          name: a.name as string,
          avgRating: Number(a.avg_rating) || 0,
          jobsCompleted: Number(a.jobs_completed) || 0,
          specialty: a.specialty as string,
        }));
        setEntries(mapped);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch leaderboard');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [specialty, limit]);

  return { entries, loading, error };
}
