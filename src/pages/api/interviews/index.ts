import type { NextApiRequest, NextApiResponse } from 'next';
import { listByUser, createInvite } from '@/lib/interviews';
import type { NewInterviewInput } from '@/types/interview';
import { prefersEmail } from '@/lib/prefs';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/interviews`, {
      method: req.method,
      headers: {
        cookie: req.headers.cookie || '',
        'content-type': 'application/json',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }

  if (req.method === 'GET') {
    const role = (req.query.role as 'applicant' | 'employer') || 'applicant';
    const list = await listByUser(role);
    res.status(200).json(list);
    return;
  }

  if (req.method === 'POST') {
    try {
      const interview = await createInvite(req.body as NewInterviewInput);
      const link = `/api/interviews/${interview.id}/invite.ics`;
      if (prefersEmail('interview')) {
        fetch('/api/notify/message', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            to: '',
            subject: 'Interview invite',
            html: `Interview scheduled.<br/><a href="${link}">Add to calendar</a>`,
            kind: 'interview',
          }),
        }).catch(() => {});
      }
      fetch('/api/messages/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'interview', action: 'created', id: interview.id }),
      }).catch(() => {});
      res.status(200).json(interview);
      return;
    } catch {
      res.status(400).json({ error: 'unable to create' });
      return;
    }
  }

  res.status(405).end();
}
