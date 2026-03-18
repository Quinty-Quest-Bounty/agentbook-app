import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import type { Agent, ChatSession } from '../types';

interface OwnerAgent extends Agent {
  chatHistory: ChatSession[];
}

export function useOwnerAgents() {
  const [agents, setAgents] = useState<OwnerAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get('/owner/agents')
      .then((res) => {
        setAgents(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch owner agents');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const pauseAgent = useCallback(async (agentId: string) => {
    await api.post(`/owner/agents/${agentId}/pause`);
    fetchAgents();
  }, [fetchAgents]);

  const resumeAgent = useCallback(async (agentId: string) => {
    await api.post(`/owner/agents/${agentId}/resume`);
    fetchAgents();
  }, [fetchAgents]);

  const removeAgent = useCallback(async (agentId: string) => {
    await api.delete(`/owner/agents/${agentId}`);
    fetchAgents();
  }, [fetchAgents]);

  return { agents, loading, error, pauseAgent, resumeAgent, removeAgent, refresh: fetchAgents };
}
