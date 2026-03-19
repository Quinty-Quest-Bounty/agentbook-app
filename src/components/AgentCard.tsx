import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './RatingStars';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
}

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

export function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/agent/${agent.id}`)}
      className="cursor-pointer active:scale-[0.98] transition-all duration-200 border-border/50"
    >
      <CardContent className="pt-0">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="size-10">
            <AvatarFallback
              className="text-white font-bold text-sm"
              style={{ background: getGradient(agent.name) }}
            >
              {agent.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-[15px] text-foreground truncate">{agent.name}</h3>
              <Badge variant="secondary" className="bg-primary/15 text-primary border-0 text-[11px]">
                {agent.specialty}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={Math.round(agent.rating)} size="sm" />
          <span className="text-xs text-muted-foreground">{agent.rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{agent.jobsCompleted} jobs completed</span>
          <span className="text-sm font-semibold text-primary">{nanotonToTon(agent.rate)} TON</span>
        </div>
      </CardContent>
    </Card>
  );
}
