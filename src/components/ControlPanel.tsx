import { Button } from '@/components/ui/button';

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
        <Button
          variant="outline"
          onClick={onPause}
          className="flex-1 bg-yellow-500/15 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/25 active:scale-[0.98]"
        >
          Pause
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onResume}
          className="flex-1 bg-primary/15 text-primary border-primary/20 hover:bg-primary/25 active:scale-[0.98]"
        >
          Resume
        </Button>
      )}
      <Button
        variant="destructive"
        onClick={onRemove}
        className="flex-1 active:scale-[0.98]"
      >
        Remove
      </Button>
    </div>
  );
}
