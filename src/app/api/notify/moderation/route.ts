import { NextResponse } from 'next/server';
import { sendMail } from '@/server/mailer';

export async function POST(req: Request) {
  const { toEmail, subject, html } = await req.json().catch(() => ({}));
  if (!toEmail || !subject || !html) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    await sendMail({ to: toEmail, subject, html });
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}

