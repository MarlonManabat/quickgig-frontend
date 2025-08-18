import type { NextApiRequest, NextApiResponse } from 'next';
import { listByUser } from '@/lib/interviews';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

function formatUtc(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  if (MODE !== 'mock') {
    const r = await fetch(`${BASE}/api/interviews/${id}/invite.ics`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    const text = await r.text();
    res.setHeader('Content-Type', 'text/calendar');
    res.status(r.status).send(text);
    return;
  }

  const all = await listByUser('applicant');
  const interview = all.find((i) => i.id === id);
  if (!interview) {
    res.status(404).end();
    return;
  }
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QuickGig//Interview//EN',
    'BEGIN:VEVENT',
    `UID:${interview.id}@quickgig.ph`,
    `DTSTAMP:${formatUtc(interview.createdAt)}`,
    `DTSTART:${formatUtc(interview.startsAt)}`,
    `DTEND:${formatUtc(interview.endsAt)}`,
    `SUMMARY:Interview: Job ${interview.jobId}`,
    `DESCRIPTION:${(interview.notes || '')}${interview.locationOrLink ? '\n' + interview.locationOrLink : ''}`,
    'ORGANIZER;CN=QuickGig:mailto:noreply@quickgig.ph',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', `attachment; filename="invite-${id}.ics"`);
  res.status(200).send(ics);
}
