import type { NextApiRequest, NextApiResponse } from 'next';
import { listThreads, ensureThread, unreadCount, latestMessage } from '@/lib/messageStore';
import { getSession } from '@/lib/auth';
const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSession(req);
  if (!user) return res.status(401).end();
  if (req.method === 'GET') {
    if (req.query.count) {
      if (MODE === 'mock') {
        return res.status(200).json({ unread: unreadCount(user.id) });
      }
      try {
        const r = await fetch(`${BASE}/api/messages?count=1`, { headers: { cookie: req.headers.cookie || '' } });
        let data = await r.json().catch(() => ({}));
        if (typeof data.count === 'number' && data.unread === undefined) data = { unread: data.count };
        return res.status(r.status).json(data);
      } catch {
        return res.status(500).json({ error: 'engine_error' });
      }
    }
    if (req.query.latest) {
      if (MODE === 'mock') {
        const m = latestMessage(user.id);
        return res.status(200).json({ latest: m ? { threadId: m.threadId, preview: m.body, fromId: m.fromId, createdAt: m.createdAt } : undefined });
      }
      try {
        const r = await fetch(`${BASE}/api/messages?latest=1`, { headers: { cookie: req.headers.cookie || '' } });
        const data = await r.json().catch(() => ({}));
        return res.status(r.status).json(data);
      } catch {
        return res.status(500).json({ error: 'engine_error' });
      }
    }
    if (MODE === 'mock') {
      return res.status(200).json({ threads: listThreads(user.id) });
    }
    try {
      const r = await fetch(`${BASE}/api/messages`, { headers: { cookie: req.headers.cookie || '' } });
      const data = await r.json().catch(() => ({}));
      return res.status(r.status).json(data);
    } catch {
      return res.status(500).json({ error: 'engine_error' });
    }
  }
  if (req.method === 'POST') {
    if (MODE === 'mock') {
      const { toId, jobId, title } = req.body || {};
      const thread = ensureThread(user.id, String(toId || ''), jobId, title);
      return res.status(200).json({ thread });
    }
    try {
      const r = await fetch(`${BASE}/api/messages`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', cookie: req.headers.cookie || '' },
        body: JSON.stringify(req.body),
      });
      const data = await r.json().catch(() => ({}));
      return res.status(r.status).json(data);
    } catch {
      return res.status(500).json({ error: 'engine_error' });
    }
  }
  res.status(405).end();
}
