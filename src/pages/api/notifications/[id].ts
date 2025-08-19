/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';
import { read, save, broadcast } from '@/lib/notificationsStore';
import { patch } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    res.status(405).end();
    return;
  }
  if (!req.cookies[env.cookieName]) {
    res.status(401).end();
    return;
  }
  const { id } = req.query as { id: string };
  const body = req.body as { read?: boolean };
  try {
    const data = await patch(`/api/notifications/${id}`, body, req, async () => {
      const items = read(req, res);
      const idx = items.findIndex((n) => n.id === id);
      if (idx === -1) throw { status: 404, message: 'Not found' };
      if (typeof body.read === 'boolean') items[idx].read = body.read;
      save(res, items);
      broadcast();
      return { ok: true };
    });
    res.status(200).json(data);
  } catch (err) {
    res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
  }
}
