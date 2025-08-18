import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    jobId?: string;
    applicantId?: string;
  };
  const { jobId, applicantId } = body;

  if (!jobId || !applicantId) {
    return NextResponse.json({ ok: true, skipped: 'invalid' });
  }

  const data = { jobId, applicantId };
  const EMAILS_ON = process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true';

  if (!EMAILS_ON) {
    return NextResponse.json({ ok: true, skipped: 'emails_disabled' });
  }

  try {
    const { sendMail } = await import('@/server/mailer');
    await sendMail({
      kind: 'apply',
      to: process.env.NOTIFY_ADMIN_EMAIL || 'admin@quickgig.ph',
      from: process.env.NOTIFY_FROM || 'QuickGig <noreply@quickgig.ph>',
      data,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('notify.application send failed', err);
    // Never break the product flow; just report a soft failure.
    return NextResponse.json(
      { ok: false, error: 'mail_failed' },
      { status: 500 },
    );
  }
}
