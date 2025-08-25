import type { NextApiRequest, NextApiResponse } from 'next';
import { assertSeedEnabled } from './_util';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try { assertSeedEnabled(req); return res.status(200).json({ ok: true }); }
  catch { return res.status(403).json({ ok: false }); }
}
