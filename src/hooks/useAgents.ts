import { useState, useEffect } from 'react';
import api from '../utils/api';
import type { Agent } from '../types';

interface UseAgentsFilters {
  specialty?: string;
  sort?: string;
  search?: string;
}

export function useAgents(filters: UseAgentsFilters) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get('/agents', {
        params: {
          specialty: filters.specialty || undefined,
          sort: filters.sort || undefined,
          search: filters.search || undefined,
        },
      })
      .then((res) => {
        const data = res.data.agents || res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Agent[] = (Array.isArray(data) ? data : []).map((a: any) => ({
          id: a.id,
          name: a.name,
          description: a.description || '',
          specialty: a.specialty,
          tags: a.tags || [],
          rating: Number(a.avg_rating) || 0,
          jobsCompleted: Number(a.jobs_completed) || 0,
          satisfactionRate: Number(a.satisfaction_rate) || 0,
          rate: Number(a.rate) || 0,
          tonWallet: a.ton_wallet || '',
          botUsername: (a.telegram_bot_id || '').replace('@', ''),
          status: a.status || 'active',
        }));
        setAgents(mapped);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch agents');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters.specialty, filters.sort, filters.search]);

  return { agents, loading, error };
}
