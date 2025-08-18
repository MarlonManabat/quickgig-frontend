/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { listInterviews, respondInterview } from '@/lib/applicantStore';
import { get, patch } from '@/lib/engine';

const throttle: Record<string, number> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };
  const path = `/api/applications/${id}/interviews`;

  if (req.method === 'GET') {
    try {
      const list = await get(path, req, () => listInterviews(id));
      res.status(200).json(list);
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
    const { id: interviewId, action, slot } = req.body || {};
    try {
      const interview = await patch(path, req.body, req, () => respondInterview(interviewId, action, slot));
      if (process.env.INTERVIEWS_WEBHOOK_URL && (action === 'accept' || action === 'decline')) {
        fetch(process.env.INTERVIEWS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: action, interview }),
        }).catch(() => {});
      }
      res.status(200).json(interview);
      return;
    } catch (err) {
      res.status(400).json({ error: (err as any).message || 'Unable to update' });
      return;
    }
  }

  res.status(405).end();
}
