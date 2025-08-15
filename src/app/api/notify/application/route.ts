import { NextResponse } from 'next/server';
import { sendMail } from '@/server/mailer';
import { env } from '@/config/env';

export async function POST(req: Request) {
  const { applicantEmail, applicantName, employerEmail, jobTitle } = await req.json();
  const safeJob = String(jobTitle || 'your application');
  const toEmployer = employerEmail || env.NOTIFY_ADMIN_EMAIL;

  if (applicantEmail) {
    await sendMail({
      to: applicantEmail,
      subject: `We received your application for ${safeJob}`,
      html: `<p>Hi ${applicantName || ''},</p><p>Thanks for applying for <b>${safeJob}</b>. We’ll be in touch.</p>`,
    }).catch(() => {});
  }

  if (toEmployer) {
    await sendMail({
      to: toEmployer,
      subject: `New application for ${safeJob}`,
      html: `<p>You have a new application for <b>${safeJob}</b>.</p>`,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
