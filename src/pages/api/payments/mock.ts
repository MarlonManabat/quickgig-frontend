import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!env.NEXT_PUBLIC_ENABLE_PAYMENTS) {
    res.status(404).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const body =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { amount, method } = body as {
    amount?: number;
    method?: string;
  };
  if (process.env.ENGINE_MODE === 'php') {
    try {
      const r = await fetch(`${process.env.ENGINE_BASE_URL}/api/v1/payments/mock`, {
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
  // mock mode
  // eslint-disable-next-line no-console -- log mock payments
  console.log('[payments] mock transaction', { amount, method });
  res.status(200).json({ ok: true });
}

export const config = { api: { bodyParser: true } };

