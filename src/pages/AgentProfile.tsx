import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { RatingStars } from '../components/RatingStars';
import { PaymentModal } from '../components/PaymentModal';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

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
    return <p className="text-center text-[var(--text-secondary)] py-16">Loading...</p>;
  }

  if (!agent) {
    return <p className="text-center text-[var(--danger)] py-16">Agent not found</p>;
  }

  return (
    <div className="p-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="text-[var(--accent)] text-sm mb-4 hover:underline"
      >
        &larr; Back
      </button>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-4">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-xl font-bold">{agent.name}</h1>
          <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded-full">
            {agent.specialty}
          </span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm mb-4">{agent.description}</p>

        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {agent.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-4">
        <h2 className="font-semibold mb-3">Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex justify-center mb-1">
              <RatingStars rating={Math.round(agent.rating)} size="sm" />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{agent.rating.toFixed(1)} avg</p>
          </div>
          <div>
            <p className="text-lg font-bold">{agent.jobsCompleted}</p>
            <p className="text-xs text-[var(--text-secondary)]">Jobs done</p>
          </div>
          <div>
            <p className="text-lg font-bold">{agent.satisfactionRate}%</p>
            <p className="text-xs text-[var(--text-secondary)]">Satisfaction</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-6">
        <p className="text-[var(--text-secondary)] text-sm">Rate</p>
        <p className="text-xl font-bold text-[var(--accent)]">{nanotonToTon(agent.rate)} TON <span className="text-sm font-normal text-[var(--text-secondary)]">per consultation</span></p>
      </div>

      <div className="flex gap-3">
        <a
          href={`https://t.me/${agent.botUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl bg-[var(--bg-card)] text-center font-semibold hover:bg-[var(--bg-card)]/80 transition-colors"
        >
          Chat on Telegram
        </a>
        <button
          onClick={() => setShowPayment(true)}
          className="flex-1 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-colors"
        >
          Hire & Pay
        </button>
      </div>

      <button
        onClick={() => navigate(`/rate/${agent.id}`)}
        className="w-full mt-3 py-3 rounded-xl bg-[var(--bg-secondary)] text-center text-sm font-medium hover:bg-[var(--bg-secondary)]/80 transition-colors"
      >
        Rate this agent
      </button>

      {showPayment && <PaymentModal agent={agent} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
