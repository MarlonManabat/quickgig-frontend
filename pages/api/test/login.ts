import type { NextApiRequest, NextApiResponse } from 'next';

const TEST_COOKIE_ROLE = 'qa_role';
const TEST_COOKIE_UID  = 'qa_uid';

// deterministic IDs per role so tests/screenshots are stable
const IDS: Record<string, string> = {
  worker:   '00000000-0000-0000-0000-000worker',
  employer: '00000000-0000-0000-0000-00employer',
  admin:    '00000000-0000-0000-0000-0000admin'
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ ok: false, error: 'Not available in production' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { role } = (req.body ?? {}) as { role?: string };
  if (!role || !IDS[role]) {
    return res.status(400).json({ ok: false, error: 'role must be worker|employer|admin' });
  }

  const uid = IDS[role];

  // 30 minutes
  const maxAge = 60 * 30;

  res.setHeader('Set-Cookie', [
    `${TEST_COOKIE_ROLE}=${role}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
    `${TEST_COOKIE_UID}=${uid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`,
  ]);

  return res.status(200).json({ ok: true, role, uid });
}
