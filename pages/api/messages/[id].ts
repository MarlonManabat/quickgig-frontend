import type { NextApiRequest, NextApiResponse } from 'next';
import { listMessages, sendMessage, getThread, markRead } from '@/lib/messageStore';
import { getSession } from '@/lib/auth';
const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const user = await getSession(req);
  if (!user) return res.status(401).end();
  if (req.method === 'GET') {
    if (MODE === 'mock') {
      return res.status(200).json({ messages: listMessages(id) });
    }
    try {
      const r = await fetch(`${BASE}/api/messages/${id}`, { headers: { cookie: req.headers.cookie || '' } });
      const data = await r.json().catch(() => ({}));
      return res.status(r.status).json(data);
    } catch {
      return res.status(500).json({ error: 'engine_error' });
    }
  }
  if (req.method === 'POST') {
    if (MODE === 'mock') {
      const thread = getThread(id);
      if (!thread) return res.status(404).json({ error: 'not_found' });
      const toId = thread.participants.find((p) => p !== user.id) || '';
      const body = String((req.body || {}).body || '');
      const m = sendMessage(thread, user.id, toId, body);
      if (process.env.MESSAGE_WEBHOOK_URL) {
        fetch(process.env.MESSAGE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'message.created', threadId: id, from: user.id, to: toId, jobId: thread.jobId, body, createdAt: m.createdAt }),
        }).catch(() => {});
      }
      return res.status(200).json({ ok: true });
    }
    try {
      const r = await fetch(`${BASE}/api/messages/${id}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', cookie: req.headers.cookie || '' },
        body: JSON.stringify(req.body),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && process.env.MESSAGE_WEBHOOK_URL) {
        const body = String((req.body || {}).body || '');
        fetch(process.env.MESSAGE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'message.created', threadId: id, from: user.id, to: undefined, jobId: undefined, body, createdAt: new Date().toISOString() }),
        }).catch(() => {});
      }
      return res.status(r.status).json(data);
    } catch {
      return res.status(500).json({ error: 'engine_error' });
    }
  }
  if (req.method === 'PUT') {
    if (MODE === 'mock') {
      markRead(id, user.id);
      return res.status(200).json({ ok: true });
    }
    try {
      const r = await fetch(`${BASE}/api/messages/${id}`, {
        method: 'PUT',
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
