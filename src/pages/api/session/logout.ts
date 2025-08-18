/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PATHS, rawRequest } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const r = await rawRequest('POST', PATHS.auth.logout, req);
    const text = await r.text();
    const cookies = r.headers.get('set-cookie');
    if (cookies) res.setHeader('set-cookie', cookies);
    res.status(r.status).send(text);
  } catch (err) {
    res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
  }
}
