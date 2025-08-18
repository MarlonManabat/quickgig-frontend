import type { NextApiRequest, NextApiResponse } from 'next';
import { sign, unsign } from './signedCookie';
import type { NotificationItem, NotificationKind } from '@/types/notification';

const COOKIE = 'notifs';
let clients: NextApiResponse[] = [];

function seed(): NotificationItem[] {
  const now = Date.now();
  const kinds: NotificationKind[] = ['message', 'application', 'interview', 'alert', 'admin'];
  const items: NotificationItem[] = [];
  kinds.forEach((kind, idx) => {
    items.push({
      id: `${kind}-1`,
      kind,
      title: `${kind} notification`,
      createdAt: new Date(now - idx * 60000).toISOString(),
      read: false,
    });
  });
  return items;
}

function write(res: NextApiResponse, items: NotificationItem[]) {
  const raw = Buffer.from(JSON.stringify(items)).toString('base64');
  const signed = sign(raw);
  res.setHeader('Set-Cookie', `${COOKIE}=${signed}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000`);
}

export function read(req: NextApiRequest, res: NextApiResponse): NotificationItem[] {
  const raw = req.cookies[COOKIE];
  if (raw) {
    const val = unsign(raw);
    if (val) {
      try {
        return JSON.parse(Buffer.from(val, 'base64').toString('utf8')) as NotificationItem[];
      } catch {
        /* ignore */
      }
    }
  }
  const seeded = seed();
  write(res, seeded);
  return seeded;
}

export function save(res: NextApiResponse, items: NotificationItem[]) {
  write(res, items);
}

export function addClient(res: NextApiResponse) {
  clients.push(res);
}

export function removeClient(res: NextApiResponse) {
  clients = clients.filter((c) => c !== res);
}

export function broadcast() {
  clients.forEach((res) => {
    try {
      res.write(`event: notifications:new\n`);
      res.write(`data: {}\n\n`);
    } catch {
      /* ignore */
    }
  });
}
