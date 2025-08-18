import { NextResponse } from 'next/server';
import { update, interviewsEnabled, listAll } from '@/src/lib/interviews';
import { sendMail } from '@/server/mailer';

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export async function GET(req: Request, ctx: { params: { id: string } }) {
  if (!interviewsEnabled()) return NextResponse.json({ ok: true, disabled: true });
  const { id } = ctx.params;
  if (MODE !== 'mock') {
    try {
      const r = await fetch(`${BASE}/api/interviews/${id}`, {
        headers: { cookie: req.headers.get('cookie') || '' },
        credentials: 'include',
      });
      if (r.status !== 404) {
        const txt = await r.text();
        return new NextResponse(txt, { status: r.status });
      }
    } catch {}
  }
  const all = listAll();
  const found = all.find((i) => i.id === id);
  if (!found) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json(found);
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  if (!interviewsEnabled()) return NextResponse.json({ ok: true, disabled: true });
  const { id } = ctx.params;
  if (MODE !== 'mock') {
    try {
      const r = await fetch(`${BASE}/api/interviews/${id}`, {
        method: 'PATCH',
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
    const iv = await update(id, data);
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
