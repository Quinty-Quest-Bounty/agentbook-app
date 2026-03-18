import { useState } from 'react';
import { useOwnerAgents } from '../hooks/useOwnerAgents';
import { ChatHistory } from '../components/ChatHistory';
import { ControlPanel } from '../components/ControlPanel';

export function OwnerDashboard() {
  const { agents, loading, error, pauseAgent, resumeAgent, removeAgent } = useOwnerAgents();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">My Agents</h1>

      {loading && <p className="text-center text-[var(--text-secondary)] py-8">Loading...</p>}
      {error && <p className="text-center text-[var(--danger)] py-8">{error}</p>}

      {!loading && !error && agents.length === 0 && (
        <p className="text-center text-[var(--text-secondary)] py-8">You have no agents registered</p>
      )}

      <div className="space-y-3">
        {agents.map((agent) => {
          const isExpanded = expandedId === agent.id;
          return (
            <div key={agent.id} className="bg-[var(--bg-card)] rounded-xl p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : agent.id)}
              >
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{agent.specialty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      agent.status === 'active'
                        ? 'bg-green-900/40 text-green-400'
                        : 'bg-yellow-900/40 text-yellow-400'
                    }`}
                  >
                    {agent.status}
                  </span>
                  <span className="text-[var(--text-secondary)]">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-medium mb-2">Chat History</h4>
                  <ChatHistory sessions={agent.chatHistory} />

                  <ControlPanel
                    status={agent.status}
                    onPause={() => pauseAgent(agent.id)}
                    onResume={() => resumeAgent(agent.id)}
                    onRemove={() => removeAgent(agent.id)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
