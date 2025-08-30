import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.E2E_STUB !== '1') return res.status(404).end();
  const role = (req.body?.role as string) || 'employer';
  const cookie = serialize('qg_role', role, { path: '/', httpOnly: false, maxAge: 60 * 60 });
  res.setHeader('Set-Cookie', cookie);
  res.json({ ok: true, role });
}
