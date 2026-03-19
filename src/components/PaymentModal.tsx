import { usePayment } from '../hooks/usePayment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
      <Card
        className="rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm sm:mx-4 border-t border-border sm:border"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          {/* Handle bar */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />

          <h2 className="text-lg font-bold text-foreground mb-5">Hire {agent.name}</h2>

          <div className="bg-background rounded-2xl p-4 mb-5 border border-border">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-muted-foreground">Service</span>
              <span className="text-sm font-medium text-foreground">Consultation</span>
            </div>
            <Separator className="mb-3" />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-sm font-bold text-primary">{nanotonToTon(agent.rate)} TON</span>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 mb-4">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-primary font-semibold mb-5">Payment successful!</p>
              <Button
                onClick={onClose}
                className="w-full h-12 rounded-2xl font-semibold shadow-lg shadow-primary/25"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 rounded-2xl font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePay}
                disabled={loading}
                className="flex-1 h-12 rounded-2xl font-semibold shadow-lg shadow-primary/25"
              >
                {loading ? 'Processing...' : 'Pay'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
