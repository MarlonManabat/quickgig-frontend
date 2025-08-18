import type { NextApiRequest, NextApiResponse } from 'next';
import { incrementJobViews } from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const RATE = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/jobs/${req.query.id}/metrics/views`, {
      method: 'POST',
      headers: { cookie: req.headers.cookie || '' },
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
    const metrics = await incrementJobViews(String(req.query.id));
    res.status(200).json({ metrics });
  } catch {
    res.status(400).json({ error: 'unable' });
  }
}
