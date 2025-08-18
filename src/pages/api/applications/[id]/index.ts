import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getApplication,
  withdrawApplication,
  appendEvent,
  seedMockApps,
} from '@/lib/applicantStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };

  if (MODE !== 'mock') {
    const url = `${BASE}/api/applications/${id}`;
    const r = await fetch(url, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '' },
      body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }

  seedMockApps();

  if (req.method === 'GET') {
    const app = await getApplication(id, req.headers.cookie);
    if (!app) {
      res.status(404).end();
      return;
    }
    res.status(200).json(app);
    return;
  }

  if (req.method === 'PATCH') {
    const ip = req.socket.remoteAddress || 'unknown';
    const last = throttle[ip] || 0;
    if (Date.now() - last < 10_000) {
      res.status(429).json({ error: 'Too many actions' });
      return;
    }
    throttle[ip] = Date.now();
    const { action, note, event } = req.body || {};
    try {
      if (action === 'withdraw') {
        const updated = await withdrawApplication(id, note, req.headers.cookie);
        res.status(200).json(updated);
        return;
      }
      if (event) {
        const updated = await appendEvent(id, event, req.headers.cookie);
        res.status(200).json(updated);
        return;
      }
    } catch {
      res.status(400).json({ error: 'Unable to update' });
      return;
    }
    res.status(400).json({ error: 'Invalid action' });
    return;
  }

  res.status(405).end();
}
