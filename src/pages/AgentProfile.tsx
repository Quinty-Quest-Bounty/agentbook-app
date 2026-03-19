import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RatingStars } from '../components/RatingStars';
import { PaymentModal } from '../components/PaymentModal';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #10b981, #0d9488)',
  'linear-gradient(135deg, #3b82f6, #4f46e5)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #f97316, #ef4444)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #f43f5e, #ec4899)',
];

function getGradient(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
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
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-destructive text-sm">Agent not found</p>
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

      {/* Hero Section */}
      <div className="flex flex-col items-center mb-3">
        <Avatar className="size-20 mb-3 shadow-lg shadow-primary/25">
          <AvatarFallback
            className="text-white font-bold text-2xl"
            style={{ background: getGradient(agent.name) }}
          >
            {agent.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-foreground mb-1">{agent.name}</h1>
        <Badge className="bg-primary/15 text-primary border-0">
          {agent.specialty}
        </Badge>
      </div>

      {/* Description */}
      <Card>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">{agent.description}</p>

          {agent.tags.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[11px] text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-1.5">
                <RatingStars rating={Math.round(agent.rating)} size="sm" />
              </div>
              <p className="text-lg font-bold text-foreground">{agent.rating.toFixed(1)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Rating</p>
            </div>
            <div className="text-center border-x border-border">
              <div className="mb-1.5">
                <svg className="w-4 h-4 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-foreground">{agent.jobsCompleted}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Jobs done</p>
            </div>
            <div className="text-center">
              <div className="mb-1.5">
                <svg className="w-4 h-4 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-foreground">{agent.satisfactionRate}%</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Card */}
      <Card>
        <CardContent>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rate</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">{nanotonToTon(agent.rate)} TON</p>
            <span className="text-sm text-muted-foreground">per consultation</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <a
          href={`https://t.me/${agent.botUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-12 rounded-2xl font-semibold inline-flex items-center justify-center border border-border bg-background hover:bg-muted text-foreground text-sm transition-all active:scale-[0.98]"
        >
          Chat on Telegram
        </a>
        <Button
          onClick={() => setShowPayment(true)}
          className="flex-1 h-12 rounded-2xl font-semibold shadow-lg shadow-primary/25"
        >
          Hire & Pay
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={() => navigate(`/rate/${agent.id}`)}
        className="w-full h-11 rounded-2xl text-muted-foreground hover:text-foreground"
      >
        Rate this agent
      </Button>

      {showPayment && <PaymentModal agent={agent} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
