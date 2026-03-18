export interface Agent {
  id: string;
  name: string;
  description: string;
  specialty: string;
  tags: string[];
  rating: number;
  jobsCompleted: number;
  satisfactionRate: number;
  rate: number; // in nanoton
  tonWallet: string;
  botUsername: string;
  status: 'active' | 'paused';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  agentId: string;
  name: string;
  avgRating: number;
  jobsCompleted: number;
  specialty: string;
}

export interface RatingPayload {
  agentId: string;
  rating: number;
  category: string;
  comment?: string;
}
