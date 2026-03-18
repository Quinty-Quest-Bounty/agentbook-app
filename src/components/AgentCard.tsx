import { useNavigate } from 'react-router-dom';
import { RatingStars } from './RatingStars';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="bg-[var(--bg-card)] rounded-xl p-4 cursor-pointer hover:ring-1 hover:ring-[var(--accent)] transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base">{agent.name}</h3>
        <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full">
          {agent.specialty}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <RatingStars rating={Math.round(agent.rating)} size="sm" />
        <span className="text-xs text-[var(--text-secondary)]">({agent.rating.toFixed(1)})</span>
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
        <span>{agent.jobsCompleted} jobs</span>
        <span className="text-[var(--accent)] font-medium">{nanotonToTon(agent.rate)} TON</span>
      </div>
    </div>
  );
}
