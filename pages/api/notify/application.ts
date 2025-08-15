import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { env } from '@/config/env';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const { applicantEmail, applicantName, employerEmail, jobTitle, applicationId } = req.body || {};
  if (!env.RESEND_API_KEY) {
    console.warn('[notify] RESEND_API_KEY missing');
    return res.status(200).json({ ok: true, skipped: 'email' });
  }
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const from = env.NOTIFY_FROM || 'QuickGig <noreply@quickgig.ph>';
    await Promise.all([
      resend.emails.send({
        from,
        to: applicantEmail,
        subject: `We received your application for ${jobTitle}.`,
        text: `Hi ${applicantName},\n\nWe received your application for ${jobTitle}.\n\nQuickGig`,
      }),
      resend.emails.send({
        from,
        to: employerEmail || env.NOTIFY_ADMIN_EMAIL,
        subject: `New application for ${jobTitle}.`,
        text: `New application submitted for ${jobTitle}. ID: ${applicationId}`,
      }),
    ]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[notify] failed', err);
    return res.status(500).json({ ok: false });
  }
}
