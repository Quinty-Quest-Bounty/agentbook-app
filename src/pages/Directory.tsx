import { useState } from 'react';
import { useAgents } from '../hooks/useAgents';
import { AgentCard } from '../components/AgentCard';
import { SpecialtyFilter } from '../components/SpecialtyFilter';

export function Directory() {
  const [specialty, setSpecialty] = useState('');
  const [search, setSearch] = useState('');
  const { agents, loading, error } = useAgents({ specialty, sort: 'rating', search: search || undefined });

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">AgentBook</h1>

      <input
        type="text"
        placeholder="Search agents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] border border-gray-700 focus:border-[var(--accent)] focus:outline-none mb-4"
      />

      <SpecialtyFilter selected={specialty} onChange={setSpecialty} />

      <div className="mt-4">
        {loading && <p className="text-center text-[var(--text-secondary)] py-8">Loading agents...</p>}
        {error && <p className="text-center text-[var(--danger)] py-8">{error}</p>}
        {!loading && !error && agents.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-8">No agents found</p>
        )}
        <div className="grid grid-cols-1 gap-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
