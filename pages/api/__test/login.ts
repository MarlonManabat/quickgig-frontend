import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.TEST_LOGIN_ENABLED !== 'true') return res.status(404).end();
  if (req.headers['x-test-secret'] !== process.env.TEST_LOGIN_SECRET) return res.status(401).end();

  const role = (req.query.role as string) || 'worker';
  const value = Buffer.from(JSON.stringify({ mock: true, role })).toString('base64url');

  res.setHeader('Set-Cookie', serialize('__qg_test_session', value, {
    path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 30
  }));
  res.status(204).end();
}
