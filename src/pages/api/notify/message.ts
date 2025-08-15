import type { NextApiRequest, NextApiResponse } from 'next';
import { sendMail } from '@/server/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }
  const { toEmail, toName, jobTitle } = req.body || {};
  if (toEmail) {
    await sendMail({
      to: toEmail,
      subject: `New message on QuickGig about ${jobTitle || ''}`,
      html: `<p>Hi ${toName || ''},</p><p>You have a new message about <b>${jobTitle || 'a job'}</b>.</p>`,
    }).catch(() => {});
  }
  res.json({ ok: true });
}
