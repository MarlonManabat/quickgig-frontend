/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getApplicationDetail,
  updateApplicationStatus,
  appendEmployerNote,
} from '@/lib/employerStore';
import { get, patch } from '@/lib/engine';

const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, appId } = req.query as { id: string; appId: string };
  const path = `/api/employer/jobs/${id}/applications/${appId}`;

  if (req.method === 'GET') {
    try {
      const app = await get(path, req, () => getApplicationDetail(id, appId, req.headers.cookie));
      if (!app) { res.status(404).end(); return; }
      res.status(200).json(app);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
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
      const data = await patch(path, req.body, req, async () => {
        if (status) return updateApplicationStatus(id, appId, status, note, req.headers.cookie);
        if (note) return appendEmployerNote(id, appId, note, req.headers.cookie);
        throw new Error('Invalid action');
      });
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ error: (err as any).message || 'Unable to update' });
    }
    return;
  }

  res.status(405).end();
}
