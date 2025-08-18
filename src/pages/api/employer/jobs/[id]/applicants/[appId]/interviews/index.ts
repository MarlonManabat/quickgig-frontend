import type { NextApiRequest, NextApiResponse } from 'next';
import { listInterviews } from '@/lib/applicantStore';
import { createInterviewInvite, updateInterviewStatus } from '@/lib/employerStore';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { jobId, appId } = req.query as { jobId: string; appId: string };

  if (MODE !== 'mock') {
    const url = `${BASE}/api/employer/jobs/${jobId}/applicants/${appId}/interviews`;
    const r = await fetch(url, {
      method: req.method,
      headers: { cookie: req.headers.cookie || '' },
      body: req.method === 'POST' || req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }

  if (req.method === 'GET') {
    const list = await listInterviews(appId);
    res.status(200).json(list);
    return;
  }

  if (req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown';
    const last = throttle[ip] || 0;
    if (Date.now() - last < 10_000) {
      res.status(429).json({ error: 'Too many actions' });
      return;
    }
    throttle[ip] = Date.now();
    try {
      const interview = await createInterviewInvite(jobId, appId, req.body);
      if (process.env.INTERVIEWS_WEBHOOK_URL) {
        fetch(process.env.INTERVIEWS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'created', interview }),
        }).catch(() => {});
      }
      res.status(200).json(interview);
      return;
    } catch {
      res.status(400).json({ error: 'Unable to create' });
      return;
    }
  }

  if (req.method === 'PATCH') {
    const ip = req.socket.remoteAddress || 'unknown';
    const last = throttle[ip] || 0;
    if (Date.now() - last < 10_000) {
      res.status(429).json({ error: 'Too many actions' });
      return;
    }
    throttle[ip] = Date.now();
    const { id, status } = req.body || {};
    try {
      const interview = await updateInterviewStatus(jobId, appId, id, status);
      res.status(200).json(interview);
      return;
    } catch {
      res.status(400).json({ error: 'Unable to update' });
      return;
    }
  }

  res.status(405).end();
}
