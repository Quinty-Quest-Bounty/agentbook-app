interface ControlPanelProps {
  status: 'active' | 'paused';
  onPause: () => void;
  onResume: () => void;
  onRemove: () => void;
}

export function ControlPanel({ status, onPause, onResume, onRemove }: ControlPanelProps) {
  return (
    <div className="flex gap-2 mt-4">
      {status === 'active' ? (
        <button
          onClick={onPause}
          className="flex-1 px-4 py-2.5 rounded-xl bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 text-sm font-medium hover:bg-yellow-500/25 active:scale-[0.98] transition-all"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onResume}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-medium hover:bg-[var(--accent)]/25 active:scale-[0.98] transition-all"
        >
          Resume
        </button>
      )}
      <button
        onClick={onRemove}
        className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--danger)]/15 text-[var(--danger)] border border-[var(--danger)]/20 text-sm font-medium hover:bg-[var(--danger)]/25 active:scale-[0.98] transition-all"
      >
        Remove
      </button>
    </div>
  );
}
