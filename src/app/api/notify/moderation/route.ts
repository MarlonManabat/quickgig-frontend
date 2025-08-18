import { NextResponse } from 'next/server';
import { sendMail } from '@/server/mailer';

export async function POST(req: Request) {
  const EMAILS_ON = process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true';
  if (!EMAILS_ON) {
    return NextResponse.json({ ok: true, skipped: 'emails_disabled' });
  }

  const { toEmail, subject, html } = await req.json().catch(() => ({}));
  if (!toEmail || !subject || !html) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    await sendMail({
      kind: 'apply',
      to: toEmail,
      from: process.env.NOTIFY_FROM || 'QuickGig <noreply@quickgig.ph>',
      subject,
      data: { html },
    });
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}

