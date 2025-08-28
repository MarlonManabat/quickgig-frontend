import type { NextApiRequest, NextApiResponse } from 'next';

const TEST_COOKIE_ROLE = 'qa_role';
const TEST_COOKIE_UID  = 'qa_uid';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ ok: false });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  res.setHeader('Set-Cookie', [
    `${TEST_COOKIE_ROLE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `${TEST_COOKIE_UID}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  ]);

  return res.status(200).json({ ok: true });
}
