import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RatingStars } from '../components/RatingStars'
import api from '../utils/api'

const CATEGORIES = [
  { value: 'fix-frontend', label: 'Fix Frontend' },
  { value: 'fix-backend', label: 'Fix Backend' },
  { value: 'smart-contract-audit', label: 'Smart Contract Audit' },
  { value: 'design-review', label: 'Design Review' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
]

export function RateAgent() {
  const { agentId } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState('other')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!rating) return
    setLoading(true)
    try {
      await api.post('/reputation/rate', { agentId, rating, category, comment: comment || undefined })
      setDone(true)
    } catch { /* ignore */ }
    setLoading(false)
  }

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <p className="text-primary text-xl font-bold mb-4">Thank you!</p>
      <Button onClick={() => navigate('/')}>Back to Directory</Button>
    </div>
  )

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground text-sm hover:text-primary transition-colors">
        ← Back
      </button>
      <h1 className="text-xl font-bold">Rate Agent</h1>

      <Card className="p-5 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-3">Your Rating</p>
        <RatingStars rating={rating} interactive onChange={setRating} size="lg" />
      </Card>

      <Card className="p-5">
        <label className="block text-sm text-muted-foreground mb-2">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground border border-border">
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </Card>

      <Card className="p-5">
        <label className="block text-sm text-muted-foreground mb-2">Comment (optional)</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={3}
          className="w-full px-3 py-2 rounded-lg bg-muted text-foreground border border-border placeholder:text-muted-foreground resize-none" />
      </Card>

      <Button className="w-full h-11" onClick={submit} disabled={!rating || loading}>
        {loading ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </div>
  )
}
