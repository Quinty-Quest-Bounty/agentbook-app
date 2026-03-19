import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { RatingStars } from '../components/RatingStars';

const CATEGORIES = [
  { value: 'fix-frontend', label: 'Fix Frontend' },
  { value: 'fix-backend', label: 'Fix Backend' },
  { value: 'smart-contract-audit', label: 'Smart Contract Audit' },
  { value: 'design-review', label: 'Design Review' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

export function RateAgent() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('other');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/reputation/rate', {
        agentId,
        rating,
        category,
        comment: comment || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit rating';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="px-4 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-20 h-20 rounded-full bg-[var(--accent)]/15 flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[var(--accent)] text-xl font-bold mb-2">Thank you!</p>
        <p className="text-[var(--text-secondary)] text-sm mb-6">Your feedback helps improve the ecosystem</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-2xl bg-[var(--accent)] text-white font-semibold shadow-lg shadow-[var(--accent-glow)] active:scale-[0.98] transition-all"
        >
          Back to Directory
        </button>
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

      <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Rate Agent</h1>

      {/* Rating Stars */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 mb-3 border border-[var(--card-border)] text-center">
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Your Rating</label>
        <div className="flex justify-center">
          <RatingStars rating={rating} interactive onChange={setRating} size="lg" />
        </div>
        {rating > 0 && (
          <p className="text-sm text-[var(--text-secondary)] mt-3">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-3 border border-[var(--card-border)]">
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 focus:outline-none appearance-none transition-all"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b8b9e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-6 border border-[var(--card-border)]">
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 border border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 focus:outline-none resize-none transition-all"
        />
      </div>

      {error && (
        <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-xl p-3 mb-4">
          <p className="text-[var(--danger)] text-sm text-center">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3.5 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold disabled:opacity-50 shadow-lg shadow-[var(--accent-glow)] active:scale-[0.98] transition-all"
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}
