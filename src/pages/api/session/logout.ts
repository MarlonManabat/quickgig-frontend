/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PATHS, rawRequest, isEngineOn } from '@/lib/engine';
import { env } from '@/config/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  if (isEngineOn() && env.NEXT_PUBLIC_ENABLE_ENGINE_AUTH) {
    try {
      await rawRequest('POST', PATHS.auth.logout, req);
    } catch {
      // ignore engine errors; still clear cookie
    }
  }
  const secure = process.env.VERCEL === '1' ? ' Secure;' : '';
  res.setHeader(
    'set-cookie',
    `${env.JWT_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${secure}`,
  );
  res.status(200).json({ ok: true });
}
