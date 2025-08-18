import { env } from '@/config/env';
import { flags } from '@/lib/flags';

const MODE = process.env.ENGINE_MODE || 'mock';

export async function payWithGcash(amount: number): Promise<boolean> {
  try {
    if (flags.paymentsLive && MODE === 'php') {
      if (!env.GCASH_MERCHANT_ID || !env.GCASH_API_KEY) {
        console.warn('[payments] GCash live credentials missing');
        return false;
      }
      const r = await fetch('/api/payments/live', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, method: 'gcash' }),
      });
      const j = await r.json().catch(() => ({}));
      return r.ok && j.ok;
    }
    const r = await fetch('/api/payments/mock', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ amount, method: 'gcash' }),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok && j.ok;
  } catch {
    return false;
  }
}

