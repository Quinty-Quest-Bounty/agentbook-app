import { usePayment } from '../hooks/usePayment';
import { nanotonToTon } from '../utils/ton';
import type { Agent } from '../types';

interface PaymentModalProps {
  agent: Agent;
  onClose: () => void;
}

export function PaymentModal({ agent, onClose }: PaymentModalProps) {
  const { pay, loading, error, success } = usePayment();

  const handlePay = () => {
    pay({
      agentId: agent.id,
      tonWallet: agent.tonWallet,
      amount: agent.rate.toString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Hire {agent.name}</h2>

        <div className="bg-[var(--bg-primary)] rounded-lg p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-[var(--text-secondary)]">Service</span>
            <span>Consultation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Amount</span>
            <span className="text-[var(--accent)] font-bold">{nanotonToTon(agent.rate)} TON</span>
          </div>
        </div>

        {error && (
          <p className="text-[var(--danger)] text-sm mb-4">{error}</p>
        )}

        {success ? (
          <div className="text-center">
            <p className="text-[var(--accent)] font-semibold mb-4">Payment successful!</p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
