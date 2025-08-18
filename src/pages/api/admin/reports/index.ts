import type { NextApiRequest, NextApiResponse } from 'next';
import { listReports, resolveReport } from '@/lib/employerStore';
import { isAdmin } from '@/auth/isAdmin';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const RATE = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const role = (req.cookies.role || '').toLowerCase();
  const email = req.cookies.email || '';
  if (!isAdmin({ role, email })) { res.status(401).end(); return; }
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/admin/reports`, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '', 'content-type': 'application/json' },
      body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
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
  if (req.method === 'GET') {
    const reports = await listReports();
    res.status(200).json({ reports });
    return;
  }
  if (req.method === 'PATCH') {
    const { id, ...patch } = req.body || {};
    try {
      const report = await resolveReport(String(id), patch);
      res.status(200).json({ report });
    } catch {
      res.status(400).json({ error: 'unable' });
    }
    return;
  }
  res.status(405).end();
}
