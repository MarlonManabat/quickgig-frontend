import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendMail } from '@/server/mailer';
import { unsign } from '@/lib/signedCookie';
import type { UserSettings } from '@/types/settings';
import { defaultsFromEnv, mergeSettings } from '@/lib/settings';

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
      if (!body.kind || allow(body.kind)) {
        const kind: 'apply' | 'interview' | 'digest' =
          body.kind === 'interview' ? 'interview' : body.kind === 'digest' ? 'digest' : 'apply';
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

function allow(kind: 'apply' | 'interview' | 'digest' | 'marketing'): boolean {
  try {
    const raw = cookies().get('settings_v1')?.value;
    let s = defaultsFromEnv();
    if (raw) {
      const v = unsign(raw);
      if (v) {
        const parsed = JSON.parse(Buffer.from(v, 'base64').toString('utf8')) as UserSettings;
        s = mergeSettings(s, parsed);
      }
    }
    const pref = s.email;
    if (pref === 'none') return false;
    if (pref === 'ops_only' && kind === 'digest') return false;
    return true;
  } catch {
    return true;
  }
}
