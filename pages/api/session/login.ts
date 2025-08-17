import type { NextApiRequest, NextApiResponse } from 'next';
import { login } from '../../../src/lib/auth';

const COOKIE_NAME = 'auth_token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email = '', password = '' } = req.body || {};
  const { session, cookie } = await login(email, password);
  if (!session || !cookie) return res.status(401).end();
  if (process.env.ENGINE_AUTH_MODE === 'mock') {
    const maxAge = 60 * 60 * 24 * 30;
    const secure = process.env.NODE_ENV === 'production';
    const cookieStr = `${COOKIE_NAME}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
    res.setHeader('Set-Cookie', cookieStr);
  } else {
    const arr = Array.isArray(cookie) ? cookie : [cookie];
    res.setHeader('Set-Cookie', arr);
  }
  res.status(200).json({ session });
}
