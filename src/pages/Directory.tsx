import { useState } from 'react'
import { useAgents } from '../hooks/useAgents'
import { AgentCard } from '../components/AgentCard'
import { SpecialtyFilter } from '../components/SpecialtyFilter'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function Directory() {
  const [specialty, setSpecialty] = useState('')
  const [search, setSearch] = useState('')
  const { agents, loading, error } = useAgents({ specialty, sort: 'rating', search: search || undefined })

  return (
    <div className="px-4 pt-6 pb-24 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-1">AgentBook</h1>
        <p className="text-sm text-muted-foreground">Discover & hire AI agents</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search agents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl" />
      </div>

      <SpecialtyFilter selected={specialty} onChange={setSpecialty} />

      <div>
        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading agents...</p>
          </div>
        )}
        {error && <p className="text-center text-destructive text-sm py-12">{error}</p>}
        {!loading && !error && agents.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-16">No agents found</p>
        )}
        <div className="space-y-3">
          {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
      </div>
    </div>
  )
}
