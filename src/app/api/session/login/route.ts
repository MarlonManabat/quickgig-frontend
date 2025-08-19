import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/config/env';
import { loginUpstream } from '@/lib/gateway';

export async function POST(req: Request) {
  const body = await req.json();
  const res = await loginUpstream(body);

  if (!res.ok) {
    const msg = await safeMessage(res);
    return NextResponse.json({ ok: false, message: msg }, { status: res.status });
  }

  let token = '';
  try { token = (await res.json())?.token ?? ''; } catch {}
  if (!token) token = new URL(res.url).searchParams.get('token') ?? '';

  if (!token) {
    const upstreamCookie = res.headers.get('set-cookie') ?? '';
    if (!upstreamCookie) return NextResponse.json({ ok: false }, { status: 502 });
    // last resort: pass through upstream cookie name if present
    const match = upstreamCookie.match(/([^=]+)=([^;]+)/);
    if (match) token = match[2];
  }

  cookies().set(env.cookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: env.maxAge,
    domain: '.quickgig.ph',
  });

  return NextResponse.json({ ok: true });
}

async function safeMessage(r: Response) {
  try { const j = await r.json(); return j?.message ?? r.statusText; } catch { return r.statusText; }
}
