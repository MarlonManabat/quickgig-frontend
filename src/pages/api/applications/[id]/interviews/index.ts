import type { NextApiRequest, NextApiResponse } from 'next';
import { listInterviews, respondInterview } from '@/lib/applicantStore';
import { sendEmail, renderEmail } from '@/lib/notify';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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
    if (req.method === 'PATCH' && r.ok) {
      try {
        const interview = JSON.parse(text);
        const { action, slot, employerEmail } = req.body || {};
        if ((action === 'accept' || action === 'decline') && (employerEmail || process.env.NOTIFY_ADMIN_EMAIL)) {
          const to = employerEmail || process.env.NOTIFY_ADMIN_EMAIL!;
          const detailUrl = `${SITE}/employer/jobs/${interview.jobId}/applicants/${interview.appId}`;
          let email;
          if (action === 'accept') {
            email = renderEmail(
              'interview:accepted',
              {
                title: req.body?.title || interview.jobId,
                when: new Date(slot?.at || '').toLocaleString(),
                tz: slot?.tz || 'UTC',
                detailUrl,
                uid: interview.id,
                startISO: slot?.at,
                durationMin: 30,
                location: interview.location || '',
                url: detailUrl,
              },
              'en',
            );
          } else {
            email = renderEmail(
              'interview:declined',
              { title: req.body?.title || interview.jobId, detailUrl },
              'en',
            );
          }
          void sendEmail(to, email.subject, email.html, email.text, email.ics);
        }
      } catch {}
    }
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
    const { id: interviewId, action, slot, employerEmail } = req.body || {};
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
      const to = employerEmail || process.env.NOTIFY_ADMIN_EMAIL;
      if (to && (action === 'accept' || action === 'decline')) {
        const detailUrl = `${SITE}/employer/jobs/${interview.jobId}/applicants/${interview.appId}`;
        let email;
        if (action === 'accept') {
          email = renderEmail(
            'interview:accepted',
            {
              title: req.body?.title || interview.jobId,
              when: new Date(slot?.at || '').toLocaleString(),
              tz: slot?.tz || 'UTC',
              detailUrl,
              uid: interview.id,
              startISO: slot?.at,
              durationMin: 30,
              location: interview.location || '',
              url: detailUrl,
            },
            'en',
          );
        } else {
          email = renderEmail(
            'interview:declined',
            { title: req.body?.title || interview.jobId, detailUrl },
            'en',
          );
        }
        void sendEmail(to, email.subject, email.html, email.text, email.ics);
      }
      return;
    } catch {
      res.status(400).json({ error: 'Unable to update' });
      return;
    }
  }

  res.status(405).end();
}
