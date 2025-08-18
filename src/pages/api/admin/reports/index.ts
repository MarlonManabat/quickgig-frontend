/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { listReports, resolveReport } from '@/lib/employerStore';
import { isAdmin } from '@/auth/isAdmin';
import { get, patch } from '@/lib/engine';

const RATE = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const role = (req.cookies.role || '').toLowerCase();
  const email = req.cookies.email || '';
  if (!isAdmin({ role, email })) { res.status(401).end(); return; }
  if (req.method === 'GET') {
    try {
      const data = await get('/api/admin/reports', req, () => listReports());
      res.status(200).json(data);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
    return;
  }
  if (req.method === 'PATCH') {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
    const now = Date.now();
    const last = RATE.get(ip) || 0;
    if (now - last < 10000) { res.status(429).json({ error: 'slow down' }); return; }
    RATE.set(ip, now);
    try {
      const data = await patch('/api/admin/reports', req.body, req, () => resolveReport(String(req.body?.id), req.body));
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ error: (err as any).message || 'unable' });
    }
    return;
  }
  res.status(405).end();
}
