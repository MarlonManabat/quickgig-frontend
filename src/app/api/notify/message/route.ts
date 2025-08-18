import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendMail } from '@/server/mailer';
import { prefersEmail } from '@/lib/prefs';
import { unsign } from '@/lib/signedCookie';
import type { UserSettings } from '@/types/settings';

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
      if (
        body.kind === 'marketing'
          ? (() => {
              try {
                const raw = cookies().get('settings')?.value;
                if (raw) {
                  const v = unsign(raw);
                  if (v) {
                    const s = JSON.parse(Buffer.from(v, 'base64').toString('utf8')) as UserSettings;
                    return s.email.marketingAllowed;
                  }
                }
              } catch {
                /* ignore */
              }
              return true;
            })()
          : !body.kind || body.kind === 'digest' || prefersEmail(body.kind)
      ) {
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
