import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (process.env.VERCEL_ENV !== 'preview' && process.env.CI !== 'true') {
    return res.status(403).json({ ok: false, error: 'disabled' });
  }
  return res.status(200).json({ ok: true });
}
