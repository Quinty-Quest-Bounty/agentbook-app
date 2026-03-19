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
          style={{ backgroundColor: 'rgba(14, 168, 133, 0.15)', borderColor: 'rgba(14, 168, 133, 0.2)' }}
          className="flex-1 px-4 py-2.5 rounded-xl text-[var(--accent)] border text-sm font-medium hover:bg-[rgba(14,168,133,0.25)] active:scale-[0.98] transition-all"
        >
          Resume
        </button>
      )}
      <button
        onClick={onRemove}
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
        className="flex-1 px-4 py-2.5 rounded-xl text-[var(--danger)] border text-sm font-medium hover:bg-[rgba(239,68,68,0.25)] active:scale-[0.98] transition-all"
      >
        Remove
      </button>
    </div>
  );
}
