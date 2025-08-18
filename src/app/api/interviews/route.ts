import { NextResponse } from 'next/server';
import { listByApp, listByEmployer, create, interviewsEnabled } from '@/src/lib/interviews';
import { sendMail } from '@/server/mailer';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export async function GET(req: Request) {
  if (!interviewsEnabled()) return NextResponse.json({ ok: true, disabled: true });
  if (MODE !== 'mock') {
    try {
      const r = await fetch(`${BASE}/api/interviews${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`, {
        headers: { cookie: req.headers.get('cookie') || '' },
        credentials: 'include',
      });
      if (r.status !== 404) {
        const txt = await r.text();
        return new NextResponse(txt, { status: r.status });
      }
    } catch {}
  }
  const { searchParams } = new URL(req.url);
  const appId = searchParams.get('appId');
  const employerId = searchParams.get('employerId');
  try {
    const list = appId
      ? await listByApp(appId)
      : employerId
      ? await listByEmployer(employerId)
      : [];
    return NextResponse.json({ ok: true, interviews: list });
  } catch {
    return NextResponse.json({ ok: false, interviews: [] });
  }
}

export async function POST(req: Request) {
  if (!interviewsEnabled()) return NextResponse.json({ ok: true, disabled: true });
  if (MODE !== 'mock') {
    try {
      const r = await fetch(`${BASE}/api/interviews`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', cookie: req.headers.get('cookie') || '' },
        credentials: 'include',
        body: await req.text(),
      });
      if (r.status !== 404) {
        const txt = await r.text();
        return new NextResponse(txt, { status: r.status });
      }
    } catch {}
  }
  const data = await req.json();
  try {
    const iv = await create(data);
    if (process.env.INTERVIEWS_WEBHOOK_URL) {
      fetch(process.env.INTERVIEWS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(iv),
      }).catch(() => {});
    }
    if (process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true') {
      sendMail({ kind: 'interview', to: process.env.NOTIFY_ADMIN_EMAIL || '', from: process.env.NOTIFY_FROM || '' }).catch(
        () => {},
      );
    }
    return NextResponse.json({ ok: true, interview: iv });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
