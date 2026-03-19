import { useState } from 'react';
import { useOwnerAgents } from '../hooks/useOwnerAgents';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatHistory } from '../components/ChatHistory';
import { ControlPanel } from '../components/ControlPanel';

export function OwnerDashboard() {
  const { agents, loading, error, pauseAgent, resumeAgent, removeAgent } = useOwnerAgents();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
            My Agents
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">Manage your registered agents</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm font-medium">No agents registered</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Register your first agent to get started</p>
        </div>
      )}

      <div className="space-y-3">
        {agents.map((agent) => {
          const isExpanded = expandedId === agent.id;
          return (
            <Card key={agent.id} className="overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-4"
                onClick={() => setExpandedId(isExpanded ? null : agent.id)}
              >
                <div className="flex items-center gap-3">
                  {/* Status dot */}
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    agent.status === 'active'
                      ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.4)]'
                      : 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{agent.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Badge
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={
                      agent.status === 'active'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }
                  >
                    {agent.status}
                  </Badge>
                  <svg
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {isExpanded && (
                <CardContent className="border-t border-border pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Chat History</h4>
                  <ChatHistory sessions={agent.chatHistory} />

                  <ControlPanel
                    status={agent.status}
                    onPause={() => pauseAgent(agent.id)}
                    onResume={() => resumeAgent(agent.id)}
                    onRemove={() => removeAgent(agent.id)}
                  />
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
