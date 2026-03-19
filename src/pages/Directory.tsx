import { useState } from 'react';
import { useAgents } from '../hooks/useAgents';
import { AgentCard } from '../components/AgentCard';
import { SpecialtyFilter } from '../components/SpecialtyFilter';
import { Input } from '@/components/ui/input';

export function Directory() {
  const [specialty, setSpecialty] = useState('');
  const [search, setSearch] = useState('');
  const { agents, loading, error } = useAgents({ specialty, sort: 'rating', search: search || undefined });

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
            AgentBook
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">Discover & hire AI agents</p>
      </div>

      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-2xl bg-[var(--input-bg)] border-border/50"
        />
      </div>

      <SpecialtyFilter selected={specialty} onChange={setSpecialty} />

      <div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading agents...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
        {!loading && !error && agents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm font-medium">No agents found</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Try a different search or filter</p>
          </div>
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
