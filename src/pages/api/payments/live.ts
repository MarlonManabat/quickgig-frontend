import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!env.NEXT_PUBLIC_ENABLE_PAYMENTS || !env.NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE) {
    res.status(404).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { amount, method } = body as { amount?: number; method?: string };
  if (process.env.ENGINE_MODE === 'php') {
    try {
      const r = await fetch(`${process.env.ENGINE_BASE_URL}/api/v1/payments/live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.cookie || '',
        },
        body: JSON.stringify({ amount, method }),
      });
      const j = await r.json().catch(() => ({}));
      res.status(r.status).json(j);
      return;
    } catch {
      /* ignore */
    }
  }
  if (method === 'stripe') {
    if (!env.STRIPE_PUBLISHABLE_KEY || !env.STRIPE_SECRET_KEY) {
      res.status(500).json({ ok: false });
      return;
    }
  }
  if (method === 'gcash') {
    if (!env.GCASH_MERCHANT_ID || !env.GCASH_API_KEY) {
      res.status(500).json({ ok: false });
      return;
    }
  }
  res.status(200).json({ ok: true });
}

export const config = { api: { bodyParser: true } };
