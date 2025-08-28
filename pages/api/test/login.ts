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
  const { role } = (req.body ?? {}) as { role?: string };
  if (!role || !['worker', 'employer', 'admin'].includes(role)) {
    return res.status(400).json({ ok: false, error: 'role required' });
  }
  const uid = role === 'admin' ? 'test-admin' : role === 'employer' ? 'test-employer' : 'test-worker';
  res.setHeader('Set-Cookie', [
    `${TEST_COOKIE_ROLE}=${role}; Path=/; HttpOnly; SameSite=Lax`,
    `${TEST_COOKIE_UID}=${uid}; Path=/; HttpOnly; SameSite=Lax`,
  ]);
  return res.status(200).json({ ok: true });
}
