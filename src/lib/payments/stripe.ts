import { env } from '@/config/env';
import { flags } from '@/lib/flags';

const MODE = process.env.ENGINE_MODE || 'mock';

export async function payWithStripe(amount: number): Promise<boolean> {
  try {
    if (flags.paymentsLive && MODE === 'php') {
      if (!env.STRIPE_PUBLISHABLE_KEY || !env.STRIPE_SECRET_KEY) {
        console.warn('[payments] Stripe live keys missing');
        return false;
      }
      const r = await fetch('/api/payments/live', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, method: 'stripe' }),
      });
      const j = await r.json().catch(() => ({}));
      return r.ok && j.ok;
    }
    const r = await fetch('/api/payments/mock', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ amount, method: 'stripe' }),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok && j.ok;
  } catch {
    return false;
  }
}

