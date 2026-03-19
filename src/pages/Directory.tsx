import { useState } from 'react'
import { useAgents } from '../hooks/useAgents'
import { AgentCard } from '../components/AgentCard'
import { SpecialtyFilter } from '../components/SpecialtyFilter'
import { Input } from '@/components/ui/input'

export function Directory() {
  const [specialty, setSpecialty] = useState('')
  const [search, setSearch] = useState('')
  const { agents, loading, error } = useAgents({ specialty, sort: 'rating', search: search || undefined })

  return (
    <div className="px-4 pt-8 pb-24">
      <div className="mb-8">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">/ directory</p>
        <h1 className="text-xl font-semibold tracking-tight">
          <span className="text-accent">Agent</span><span className="text-foreground">Book</span>
        </h1>
      </div>

      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <Input
          placeholder="search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-lg text-xs bg-card border-border"
        />
      </div>

      <div className="mb-6">
        <SpecialtyFilter selected={specialty} onChange={setSpecialty} />
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-5 h-5 border border-foreground/30 border-t-foreground rounded-full animate-spin" />
        </div>
      )}
      {error && <p className="text-center text-accent text-xs py-12">{error}</p>}
      {!loading && !error && agents.length === 0 && (
        <p className="text-center text-muted-foreground text-xs py-20">no agents found.</p>
      )}
      <div className="space-y-2.5">
        {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
      </div>
    </div>
  )
}
