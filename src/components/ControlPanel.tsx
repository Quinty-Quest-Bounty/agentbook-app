interface ControlPanelProps {
  status: 'active' | 'paused';
  onPause: () => void;
  onResume: () => void;
  onRemove: () => void;
}

export function ControlPanel({ status, onPause, onResume, onRemove }: ControlPanelProps) {
  return (
    <div className="flex gap-2 mt-3">
      {status === 'active' ? (
        <button
          onClick={onPause}
          className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onResume}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
        >
          Resume
        </button>
      )}
      <button
        onClick={onRemove}
        className="px-4 py-2 rounded-lg bg-[var(--danger)] hover:bg-red-700 text-white text-sm font-medium transition-colors"
      >
        Remove
      </button>
    </div>
  );
}
