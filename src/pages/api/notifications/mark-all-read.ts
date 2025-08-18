/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';
import type { NotificationKind } from '@/types/notification';
import { read, save, broadcast } from '@/lib/notificationsStore';
import { post } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  if (!req.cookies[env.JWT_COOKIE_NAME]) {
    res.status(401).end();
    return;
  }
  const body = req.body as { kind?: NotificationKind };
  try {
    const data = await post('/api/notifications/mark-all-read', body, req, async () => {
      const items = read(req, res).map((n) => !body.kind || n.kind === body.kind ? { ...n, read: true } : n);
      save(res, items);
      broadcast();
      return { ok: true };
    });
    res.status(200).json(data);
  } catch (err) {
    res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
  }
}
