import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getApplicationDetail,
  updateApplicationStatus,
  appendEmployerNote,
} from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, appId } = req.query as { id: string; appId: string };

  if (MODE !== 'mock') {
    const url = `${BASE}/api/employer/jobs/${id}/applications/${appId}`;
    const r = await fetch(url, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '' },
      body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }

  if (req.method === 'GET') {
    const app = await getApplicationDetail(id, appId, req.headers.cookie);
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
    const { status, note } = req.body || {};
    try {
      if (status) {
        const updated = await updateApplicationStatus(id, appId, status, note, req.headers.cookie);
        res.status(200).json(updated);
        return;
      }
      if (note) {
        const updated = await appendEmployerNote(id, appId, note, req.headers.cookie);
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
