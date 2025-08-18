import type { NextApiRequest, NextApiResponse } from 'next';
import { listInterviews, respondInterview } from '@/lib/applicantStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };

  if (MODE !== 'mock') {
    const url = `${BASE}/api/applications/${id}/interviews`;
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
    const list = await listInterviews(id);
    res.status(200).json(list);
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
    const { id: interviewId, action, slot } = req.body || {};
    try {
      const interview = await respondInterview(interviewId, action, slot);
      if (process.env.INTERVIEWS_WEBHOOK_URL && (action === 'accept' || action === 'decline')) {
        fetch(process.env.INTERVIEWS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: action, interview }),
        }).catch(() => {});
      }
      res.status(200).json(interview);
      return;
    } catch {
      res.status(400).json({ error: 'Unable to update' });
      return;
    }
  }

  res.status(405).end();
}
