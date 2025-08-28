import type { NextApiRequest, NextApiResponse } from 'next';

const TEST_COOKIE_ROLE = 'qg_test_role';
const TEST_COOKIE_UID = 'qg_test_uid';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.VERCEL_ENV !== 'preview' && process.env.CI !== 'true') {
    return res.status(403).json({ ok: false, error: 'disabled' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  res.setHeader('Set-Cookie', [
    `${TEST_COOKIE_ROLE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `${TEST_COOKIE_UID}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  ]);
  return res.status(200).json({ ok: true });
}
