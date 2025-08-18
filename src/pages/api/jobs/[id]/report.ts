/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { createReport } from '@/lib/employerStore';
import { rawRequest } from '@/lib/engine';

const WEBHOOK = process.env.ALERTS_WEBHOOK_URL || '';
const RATE = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (req.method !== 'POST') { res.status(405).end(); return; }
  if (process.env.ENGINE_MODE === 'php') {
    try {
      const r = await rawRequest('POST', `/api/jobs/${id}/report`, req, req.body);
      const text = await r.text();
      res.status(r.status).send(text);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
  const now = Date.now();
  const last = RATE.get(ip) || 0;
  if (now - last < 10000) { res.status(429).json({ error: 'slow down' }); return; }
  RATE.set(ip, now);
  try {
    const report = await createReport({ jobId: id, reason: req.body.reason, notes: req.body.notes });
    if (WEBHOOK) {
      fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'job_report', report }),
      }).catch(() => {});
    }
    res.status(200).json({ report });
  } catch {
    res.status(400).json({ error: 'unable' });
  }
}
