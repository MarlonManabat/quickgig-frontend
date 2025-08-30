import type { NextApiRequest, NextApiResponse } from 'next';
let seeded = false;
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (process.env.E2E_STUB !== '1') return res.status(404).end();
  seeded = true; res.json({ ok: true, seeded });
}
