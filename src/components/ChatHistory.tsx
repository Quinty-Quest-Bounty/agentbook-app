import type { ChatSession } from '../types';

interface ChatHistoryProps {
  sessions: ChatSession[];
}

export function ChatHistory({ sessions }: ChatHistoryProps) {
  if (sessions.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] py-4">No chat history yet</p>;
  }

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {sessions.map((session) => (
        <div key={session.id} className="bg-[var(--bg-primary)] rounded-lg p-3">
          <p className="text-xs text-[var(--text-secondary)] mb-2">
            Session with user {session.userId} - {new Date(session.createdAt).toLocaleDateString()}
          </p>
          <div className="space-y-2">
            {session.messages.map((msg) => (
              <div
                key={msg.id}
                className={`text-sm p-2 rounded ${
                  msg.role === 'agent'
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'bg-gray-800 text-[var(--text-primary)]'
                }`}
              >
                <span className="font-medium text-xs uppercase">{msg.role}: </span>
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
