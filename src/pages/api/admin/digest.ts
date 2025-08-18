/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { listReports, listJobs } from '@/lib/employerStore';

const RATE = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = req.query.secret;
  if (secret !== process.env.ALERTS_DIGEST_SECRET) { res.status(401).end(); return; }
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
  const now = Date.now();
  const last = RATE.get(ip) || 0;
  if (now - last < 10000) { res.status(429).json({ error: 'slow down' }); return; }
  RATE.set(ip, now);
  const since = now - 24 * 60 * 60 * 1000;
  const reports = (await listReports()).filter(r => Date.parse(r.createdAt) >= since);
  const jobs = await listJobs();
  let views = 0;
  let applies = 0;
  for (const j of jobs) {
    if (j.metrics && Date.parse(j.metrics.updatedAt) >= since) {
      views += j.metrics.views || 0;
      applies += j.metrics.applies || 0;
    }
  }
  const digest = { reports: reports.length, views, applies };
  if (process.env.ALERTS_WEBHOOK_URL) {
    fetch(process.env.ALERTS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'digest', ...digest }),
    }).catch(() => {});
  }
  res.status(200).json(digest);
}
