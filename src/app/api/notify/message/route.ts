import { NextResponse } from 'next/server';
import { sendMail } from '@/server/mailer';
import { prefersEmail } from '@/lib/prefs';

export async function POST(req: Request) {
  const EMAILS_ON = process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true';
  if (!EMAILS_ON) {
    return NextResponse.json({ ok: true, skipped: 'emails_disabled' });
  }

  try {
    const body = (await req.json().catch(() => null)) as {
      to: string;
      subject: string;
      html: string;
      kind?: 'apply' | 'interview' | 'digest' | 'marketing';
    } | null;
    if (body) {
      if (!body.kind || body.kind === 'digest' || prefersEmail(body.kind)) {
        const kind:
          | 'apply'
          | 'interview'
          | 'digest' = body.kind === 'interview'
          ? 'interview'
          : body.kind === 'digest'
          ? 'digest'
          : 'apply';
        await sendMail({
          kind,
          to: body.to,
          from: process.env.NOTIFY_FROM || 'QuickGig <noreply@quickgig.ph>',
          subject: body.subject,
          data: { html: body.html },
        }).catch(() => {});
      } else {
        // eslint-disable-next-line no-console -- best effort log
        console.log('[notify:skipped by prefs]');
      }
    }
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}
