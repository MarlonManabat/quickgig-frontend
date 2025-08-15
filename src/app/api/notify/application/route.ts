import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { env } from '@/config/env';

export async function POST(req: NextRequest) {
  const { applicantEmail, applicantName, employerEmail, jobTitle, applicationId } = await req.json();
  if (!env.RESEND_API_KEY) {
    console.warn('[notify] RESEND_API_KEY missing');
    return NextResponse.json({ ok: true, skipped: 'email' });
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[notify] failed', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
