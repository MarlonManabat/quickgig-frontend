import type { NextApiRequest, NextApiResponse } from 'next';
import { logout } from '../../../src/lib/auth';

const COOKIE_NAME = 'auth_token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  await logout();
  const secure = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`);
  res.status(200).json({ ok: true });
}
