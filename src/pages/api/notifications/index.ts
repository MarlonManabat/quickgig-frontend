import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';
import type { NotificationKind, NotificationList } from '@/types/notification';
import { read, save } from '@/lib/notificationsStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const AUTH_MODE = process.env.ENGINE_AUTH_MODE || '';
const BASE = process.env.ENGINE_BASE_URL || '';

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

  if (MODE !== 'mock' && AUTH_MODE === 'php' && BASE) {
    const url = new URL(`${BASE}/api/notifications`);
    if (kind) url.searchParams.set('kind', String(kind));
    if (page) url.searchParams.set('page', String(page));
    if (size) url.searchParams.set('size', String(size));
    try {
      const r = await fetch(url.toString(), {
        method: 'GET',
        headers: { cookie: req.headers.cookie || '' },
      });
      if (r.ok) {
        const text = await r.text();
        res.status(200).send(text);
        return;
      }
    } catch (err) {
      // eslint-disable-next-line no-console -- best effort log
      console.warn('[notifications] upstream failed', err);
    }
  }

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
  res.status(200).json(list);
  save(res, items);
}
