import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.TEST_LOGIN_ENABLED !== 'true') return res.status(404).end();

  const role = (req.query.role as 'employer' | 'seeker') || 'seeker';
  // set short-lived test cookie recognized by middleware (existing codebase behavior)
  res.setHeader(
    'Set-Cookie',
    serialize('qg_test_login', role, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 900,
    })
  );
  res.redirect(302, '/start');
}
