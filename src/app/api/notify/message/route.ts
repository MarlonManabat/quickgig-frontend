import { NextResponse } from 'next/server';
import { sendMail } from '@/server/mailer';
import { prefersEmail } from '@/lib/prefs';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      to: string;
      subject: string;
      html: string;
      kind?: 'apply' | 'interview' | 'digest' | 'marketing';
    } | null;
    if (body) {
      if (!body.kind || body.kind === 'digest' || prefersEmail(body.kind)) {
        await sendMail(body).catch(() => {});
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
