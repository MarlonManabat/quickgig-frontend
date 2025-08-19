import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { copySetCookie } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  let password = '';
  try {
    const body = await req.json();
    const { name, email } = body || {};
    password = body?.password ?? '';
    const payload = JSON.stringify({ name, email, password });
    const init: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      cache: 'no-store',
    };
    let upstream = await fetch(`${env.API_URL}/auth/register`, init);
    if (upstream.status === 404) {
      upstream = await fetch(`${env.API_URL}/auth/signup`, init);
    }
    const cookieInit = copySetCookie(upstream);
    if (upstream.ok) {
      return NextResponse.json({ ok: true }, { ...cookieInit, status: 201 });
    }
    const text = await upstream.text();
    const sanitized = password ? text.replaceAll(password, '') : text;
    console.error('[register]', upstream.status, sanitized.slice(0, 100));
    return NextResponse.json(
      { ok: false, error: sanitized, status: upstream.status },
      { ...cookieInit, status: upstream.status },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const sanitized = password ? msg.replaceAll(password, '') : msg;
    console.error('[register]', 500, String(sanitized).slice(0, 100));
    return NextResponse.json(
      { ok: false, error: sanitized, status: 500 },
      { status: 500 },
    );
  }
}
