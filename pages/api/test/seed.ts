import type { NextApiRequest, NextApiResponse } from 'next';
let seeded = false;
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') return res.status(404).end();
  seeded = true;
  res.json({ ok: true, seeded });
}
