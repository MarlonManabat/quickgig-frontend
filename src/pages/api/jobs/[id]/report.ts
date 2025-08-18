import type { NextApiRequest, NextApiResponse } from 'next';
import { createReport } from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const WEBHOOK = process.env.ALERTS_WEBHOOK_URL || '';
const RATE = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (req.method !== 'POST') { res.status(405).end(); return; }
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/jobs/${id}/report`, {
      method: 'POST',
      headers: { cookie: req.headers.cookie || '', 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const text = await r.text();
    res.status(r.status).send(text);
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
