'use client';

import { useState } from 'react';
import { t } from '@/lib/i18n';
import { flags } from '@/lib/flags';
import { payWithGcash } from '@/lib/payments/gcash';
import { payWithStripe } from '@/lib/payments/stripe';

interface CheckoutProps {
  amount: number;
  onSuccess?: () => void;
}

export default function Checkout({ amount, onSuccess }: CheckoutProps) {
  const [loading, setLoading] = useState<string | null>(null);
  if (!flags.payments) return null;

  const handleGcash = async () => {
    setLoading('gcash');
    const ok = await payWithGcash(amount);
    setLoading(null);
    if (ok) onSuccess?.();
  };
  const handleStripe = async () => {
    setLoading('stripe');
    const ok = await payWithStripe(amount);
    setLoading(null);
    if (ok) onSuccess?.();
  };

  return (
    <div className="flex space-x-2">
      {flags.gcash && (
        <button
          type="button"
          onClick={handleGcash}
          disabled={loading !== null}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {t('pay_with_gcash')}
        </button>
      )}
      {flags.stripe && (
        <button
          type="button"
          onClick={handleStripe}
          disabled={loading !== null}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {t('pay_with_card')}
        </button>
      )}
    </div>
  );
}

