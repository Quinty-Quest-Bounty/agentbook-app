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
        setAgents(res.data);
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
