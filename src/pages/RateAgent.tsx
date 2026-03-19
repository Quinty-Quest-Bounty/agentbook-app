import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-primary text-xl font-bold mb-2">Thank you!</p>
        <p className="text-muted-foreground text-sm mb-6">Your feedback helps improve the ecosystem</p>
        <Button
          onClick={() => navigate('/')}
          className="px-8 h-12 rounded-2xl font-semibold shadow-lg shadow-primary/25"
        >
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-primary -ml-2 mb-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Button>

      <h1 className="text-2xl font-bold text-foreground">Rate Agent</h1>

      {/* Rating Stars */}
      <Card>
        <CardContent className="text-center">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Rating</label>
          <div className="flex justify-center">
            <RatingStars rating={rating} interactive onChange={setRating} size="lg" />
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardContent>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background text-foreground border border-border focus:border-ring focus:ring-1 focus:ring-ring/50 focus:outline-none appearance-none transition-all"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239494ab'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Comment */}
      <Card>
        <CardContent>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-background text-foreground border border-border focus:border-ring focus:ring-1 focus:ring-ring/50 focus:outline-none resize-none transition-all placeholder:text-muted-foreground"
          />
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
          <p className="text-destructive text-sm text-center">{error}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full h-12 rounded-2xl font-semibold shadow-lg shadow-primary/25"
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </div>
  );
}
