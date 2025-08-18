/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { get, PATHS, patch } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await get(PATHS.profile.get, req, async () => ({ id: 'mock', name: 'Mock User' }));
      res.status(200).json(data);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  if (req.method === 'PATCH') {
    try {
      const data = await patch(PATHS.profile.update, req.body, req, async () => ({ ok: true }));
      res.status(200).json(data);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  res.status(405).end();
}
