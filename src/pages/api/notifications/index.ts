/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';
import type { NotificationKind, NotificationList } from '@/types/notification';
import { read, save } from '@/lib/notificationsStore';
import { get } from '@/lib/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  if (!req.cookies[env.JWT_COOKIE_NAME]) {
    res.status(401).end();
    return;
  }
  const { kind = 'all', page = '1', size } = req.query;
  const pageNum = Number(page) || 1;
  const pageSize = Number(size) || env.NOTIFS_PAGE_SIZE;

  const search = new URLSearchParams();
  if (kind) search.set('kind', String(kind));
  if (page) search.set('page', String(page));
  if (size) search.set('size', String(size));

  try {
    const data = await get(`/api/notifications?${search.toString()}`, req, async () => {
      const items = read(req, res);
      const k = String(kind) as NotificationKind | 'all';
      const filtered = k === 'all' ? items : items.filter((n) => n.kind === k);
      const start = (pageNum - 1) * pageSize;
      const paged = filtered.slice(start, start + pageSize);
      const list: NotificationList = {
        items: paged,
        total: filtered.length,
        unread: filtered.filter((n) => !n.read).length,
      };
      save(res, items);
      return list;
    });
    res.status(200).json(data);
  } catch (err) {
    res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
  }
}
