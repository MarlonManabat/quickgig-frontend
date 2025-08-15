import { NextResponse } from 'next/server';
import { sendMail } from '@/server/mailer';

export async function POST(req: Request) {
  const { toEmail, toName, jobTitle } = await req.json();
  if (toEmail) {
    await sendMail({
      to: toEmail,
      subject: `New message on QuickGig about ${jobTitle || ''}`,
      html: `<p>Hi ${toName || ''},</p><p>You have a new message about <b>${jobTitle || 'a job'}</b>.</p>`,
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
