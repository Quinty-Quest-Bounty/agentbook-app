import { useNavigate } from 'react-router-dom';
import { RatingStars } from './RatingStars';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
}

const AVATAR_COLORS = [
  'linear-gradient(135deg, #10b981, #0d9488)',  // emerald to teal
  'linear-gradient(135deg, #3b82f6, #4f46e5)',  // blue to indigo
  'linear-gradient(135deg, #a855f7, #ec4899)',  // purple to pink
  'linear-gradient(135deg, #f97316, #ef4444)',  // orange to red
  'linear-gradient(135deg, #06b6d4, #3b82f6)',  // cyan to blue
  'linear-gradient(135deg, #f43f5e, #ec4899)',  // rose to pink
];

function getGradient(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all duration-200"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--card-border)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div style={{ background: getGradient(agent.name) }} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{agent.name.charAt(0).toUpperCase()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-[15px] text-[var(--text-primary)] truncate">{agent.name}</h3>
            <span style={{ backgroundColor: 'rgba(14, 168, 133, 0.15)' }} className="text-[11px] font-medium text-[var(--accent)] px-2.5 py-0.5 rounded-full flex-shrink-0">
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
