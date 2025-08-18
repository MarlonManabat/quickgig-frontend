import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/config/env';
import { read, save, broadcast } from '@/lib/notificationsStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const AUTH_MODE = process.env.ENGINE_AUTH_MODE || '';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    res.status(405).end();
    return;
  }
  if (!req.cookies[env.JWT_COOKIE_NAME]) {
    res.status(401).end();
    return;
  }
  const { id } = req.query;
  const body = req.body as { read?: boolean };
  if (MODE !== 'mock' && AUTH_MODE === 'php' && BASE) {
    try {
      const r = await fetch(`${BASE}/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', cookie: req.headers.cookie || '' },
        body: JSON.stringify(body),
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
  const idx = items.findIndex((n) => n.id === id);
  if (idx === -1) {
    res.status(404).end();
    return;
  }
  if (typeof body.read === 'boolean') {
    items[idx].read = body.read;
  }
  save(res, items);
  broadcast();
  res.status(200).json({ ok: true });
}
