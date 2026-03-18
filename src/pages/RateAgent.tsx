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
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-[var(--accent)] text-xl font-bold mb-4">Thank you for your feedback!</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="text-[var(--accent)] text-sm mb-4 hover:underline"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Rate Agent</h1>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Your Rating</label>
        <div className="flex justify-center">
          <RatingStars rating={rating} interactive onChange={setRating} size="lg" />
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-4">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-gray-700 focus:border-[var(--accent)] focus:outline-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl p-5 mb-6">
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] border border-gray-700 focus:border-[var(--accent)] focus:outline-none resize-none"
        />
      </div>

      {error && <p className="text-[var(--danger)] text-sm mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}
