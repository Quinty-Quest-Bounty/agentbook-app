import { useNavigate } from 'react-router-dom';
import { RatingStars } from './RatingStars';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
}

const AVATAR_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
];

function getGradient(name: string) {
  const index = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="bg-[var(--bg-card)] rounded-2xl p-4 cursor-pointer border border-[var(--card-border)] hover:border-[var(--accent)]/30 active:scale-[0.98] transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient(agent.name)} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-sm">{agent.name.charAt(0).toUpperCase()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-[15px] text-[var(--text-primary)] truncate">{agent.name}</h3>
            <span className="text-[11px] font-medium bg-[var(--accent)]/15 text-[var(--accent)] px-2.5 py-0.5 rounded-full flex-shrink-0">
              {agent.specialty}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <RatingStars rating={Math.round(agent.rating)} size="sm" />
        <span className="text-xs text-[var(--text-secondary)]">{agent.rating.toFixed(1)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)]">{agent.jobsCompleted} jobs completed</span>
        <span className="text-sm font-semibold text-[var(--accent)]">{nanotonToTon(agent.rate)} TON</span>
      </div>
    </div>
  );
}
