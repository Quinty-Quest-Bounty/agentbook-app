import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { RatingStars } from '../components/RatingStars';
import { PaymentModal } from '../components/PaymentModal';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

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

export function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    api
      .get(`/agents/${id}`)
      .then((res) => {
        const a = res.data;
        setAgent({
          id: a.id,
          name: a.name,
          description: a.description,
          specialty: a.specialty,
          tags: a.tags || [],
          rating: Number(a.avg_rating) || 0,
          jobsCompleted: Number(a.jobs_completed) || 0,
          satisfactionRate: Number(a.satisfaction_rate) || 0,
          rate: Number(a.rate) || 0,
          tonWallet: a.ton_wallet || '',
          botUsername: (a.telegram_bot_id || '').replace('@', ''),
          status: a.status || 'active',
        });
      })
      .catch(() => setAgent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-[var(--danger)] text-sm">Agent not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[var(--text-secondary)] text-sm mb-5 hover:text-[var(--accent)] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Hero Section */}
      <div className="flex flex-col items-center mb-6">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGradient(agent.name)} flex items-center justify-center mb-3 shadow-lg shadow-[var(--accent-glow)]`}>
          <span className="text-white font-bold text-2xl">{agent.name.charAt(0).toUpperCase()}</span>
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{agent.name}</h1>
        <span className="text-xs font-medium bg-[var(--accent)]/15 text-[var(--accent)] px-3 py-1 rounded-full">
          {agent.specialty}
        </span>
      </div>

      {/* Description */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-3 border border-[var(--card-border)]">
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{agent.description}</p>

        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {agent.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-medium bg-[var(--glass-bg)] text-[var(--text-secondary)] px-2.5 py-1 rounded-lg border border-[var(--glass-border)]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-3 border border-[var(--card-border)]">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-1.5">
              <RatingStars rating={Math.round(agent.rating)} size="sm" />
            </div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{agent.rating.toFixed(1)}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Rating</p>
          </div>
          <div className="text-center border-x border-[var(--glass-border)]">
            <div className="mb-1.5">
              <svg className="w-4 h-4 text-[var(--accent)] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{agent.jobsCompleted}</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Jobs done</p>
          </div>
          <div className="text-center">
            <div className="mb-1.5">
              <svg className="w-4 h-4 text-[var(--accent)] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{agent.satisfactionRate}%</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Rate Card */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-6 border border-[var(--card-border)]">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Rate</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-[var(--accent)]">{nanotonToTon(agent.rate)} TON</p>
          <span className="text-sm text-[var(--text-secondary)]">per consultation</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-3">
        <a
          href={`https://t.me/${agent.botUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-center font-semibold text-sm text-[var(--text-primary)] hover:bg-[var(--glass-border)] active:scale-[0.98] transition-all"
        >
          Chat on Telegram
        </a>
        <button
          onClick={() => setShowPayment(true)}
          className="flex-1 py-3.5 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm shadow-lg shadow-[var(--accent-glow)] active:scale-[0.98] transition-all"
        >
          Hire & Pay
        </button>
      </div>

      <button
        onClick={() => navigate(`/rate/${agent.id}`)}
        className="w-full py-3 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-center text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-border)] active:scale-[0.98] transition-all"
      >
        Rate this agent
      </button>

      {showPayment && <PaymentModal agent={agent} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
