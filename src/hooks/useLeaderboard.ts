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
        setEntries(res.data);
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
