import type { NextApiRequest, NextApiResponse } from 'next';
import { updateInterview, listByUser } from '@/lib/interviews';
import type { Interview } from '@/types/interview';
import { prefersEmail } from '@/lib/prefs';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/interviews/${id}`, {
      method: req.method,
      headers: {
        cookie: req.headers.cookie || '',
        'content-type': 'application/json',
      },
      body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
    });
    const text = await r.text();
    res.status(r.status).send(text);
    return;
  }

  if (req.method === 'GET') {
    const all = await listByUser('applicant');
    const found = all.find((i) => i.id === id);
    if (!found) {
      res.status(404).end();
      return;
    }
    res.status(200).json(found);
    return;
  }

  if (req.method === 'PATCH') {
    try {
      const interview = await updateInterview(id, req.body as Partial<Interview>);
      const link = `/api/interviews/${interview.id}/invite.ics`;
      if (prefersEmail('interview')) {
        fetch('/api/notify/message', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            to: '',
            subject: 'Interview update',
            html: `Interview updated.<br/><a href="${link}">Add to calendar</a>`,
            kind: 'interview',
          }),
        }).catch(() => {});
      }
      fetch('/api/messages/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'interview', action: 'updated', id: interview.id }),
      }).catch(() => {});
      res.status(200).json(interview);
      return;
    } catch {
      res.status(400).json({ error: 'unable to update' });
      return;
    }
  }

  res.status(405).end();
}
