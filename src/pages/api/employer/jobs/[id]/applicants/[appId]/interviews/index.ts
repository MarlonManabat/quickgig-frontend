/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { listInterviews } from '@/lib/applicantStore';
import { createInterviewInvite, updateInterviewStatus } from '@/lib/employerStore';
import { get, post, patch } from '@/lib/engine';

const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { jobId, appId } = req.query as { jobId: string; appId: string };
  const path = `/api/employer/jobs/${jobId}/applicants/${appId}/interviews`;

  if (req.method === 'GET') {
    try {
      const list = await get(path, req, () => listInterviews(appId));
      res.status(200).json(list);
    } catch (err) {
      res.status((err as any).status || 500).json({ error: (err as any).message || 'engine error' });
    }
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
      const interview = await post(path, req.body, req, () => createInterviewInvite(jobId, appId, req.body));
      if (process.env.INTERVIEWS_WEBHOOK_URL) {
        fetch(process.env.INTERVIEWS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'created', interview }),
        }).catch(() => {});
      }
      res.status(200).json(interview);
      return;
    } catch (err) {
      res.status(400).json({ error: (err as any).message || 'Unable to create' });
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
      const interview = await patch(path, req.body, req, () => updateInterviewStatus(jobId, appId, id, status));
      res.status(200).json(interview);
      return;
    } catch (err) {
      res.status(400).json({ error: (err as any).message || 'Unable to update' });
      return;
    }
  }

  res.status(405).end();
}
