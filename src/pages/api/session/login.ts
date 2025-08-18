/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PATHS, rawRequest, isEngineOn } from '@/lib/engine';
import { env } from '@/config/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  if (isEngineOn() && env.NEXT_PUBLIC_ENABLE_ENGINE_AUTH) {
    try {
      const r = await rawRequest('POST', PATHS.auth.login, req, req.body);
      const text = await r.text();
      const cookies = r.headers.get('set-cookie') || '';
      const match = cookies.match(new RegExp(`${env.JWT_COOKIE_NAME}=([^;]+)`));
      const token = match ? match[1] : '';
      const mAge = cookies.match(/max-age=(\d+)/i);
      const maxAge = mAge ? parseInt(mAge[1], 10) : 60 * 60 * 24 * 30;
      const secure = process.env.VERCEL === '1' ? ' Secure;' : '';
      if (token) {
        res.setHeader('set-cookie', `${env.JWT_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};${secure}`);
      }
      res.status(r.status).send(text);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  // mock login fallback
  const secure = process.env.VERCEL === '1' ? ' Secure;' : '';
  res.setHeader(
    'set-cookie',
    `${env.JWT_COOKIE_NAME}=mock; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30};${secure}`,
  );
  res.status(200).json({ ok: true });
}
