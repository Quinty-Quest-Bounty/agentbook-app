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
    <div className="px-5 pt-8 pb-24">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold tracking-tight">
          <span className="text-accent">Agent</span><span className="text-foreground">Book</span>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Discover & hire AI agents</p>
      </div>

      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-2xl bg-secondary border-border text-sm"
        />
      </div>

      <div className="mb-6">
        <SpecialtyFilter selected={specialty} onChange={setSpecialty} />
      </div>

      {loading && (
        <div className="flex flex-col items-center py-20">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      )}
      {error && <p className="text-center text-accent text-sm py-12">{error}</p>}
      {!loading && !error && agents.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-20">No agents found</p>
      )}
      <div className="space-y-3">
        {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
      </div>
    </div>
  )
}
