import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import api from '../utils/api';

interface PaymentOptions {
  agentId: string;
  tonWallet: string;
  amount: string; // nanoton
}

export function usePayment() {
  const [tonConnectUI] = useTonConnectUI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pay = async ({ agentId, tonWallet, amount }: PaymentOptions) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: tonWallet,
            amount,
          },
        ],
      });

      await api.post('/payment/confirm', {
        agentId,
        txHash: result.boc,
        amount,
      });

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { pay, loading, error, success };
}
