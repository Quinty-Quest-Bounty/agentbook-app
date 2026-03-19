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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[var(--bg-secondary)] rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-sm border-t border-[var(--glass-border)] sm:border sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-[var(--glass-border)] rounded-full mx-auto mb-5 sm:hidden" />

        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5">Hire {agent.name}</h2>

        <div className="bg-[var(--bg-primary)] rounded-2xl p-4 mb-5 border border-[var(--card-border)]">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-[var(--text-secondary)]">Service</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">Consultation</span>
          </div>
          <div className="border-t border-[var(--glass-border)] pt-3 flex justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Amount</span>
            <span className="text-sm font-bold text-[var(--accent)]">{nanotonToTon(agent.rate)} TON</span>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }} className="border rounded-xl p-3 mb-4">
            <p className="text-[var(--danger)] text-sm text-center">{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div style={{ backgroundColor: 'rgba(14, 168, 133, 0.15)' }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[var(--accent)] font-semibold mb-5">Payment successful!</p>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[var(--accent)] text-white font-semibold shadow-lg shadow-[var(--accent-glow)] active:scale-[0.98] transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--glass-border)] active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={loading}
              className="flex-1 py-3.5 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm disabled:opacity-50 shadow-lg shadow-[var(--accent-glow)] active:scale-[0.98] transition-all"
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
