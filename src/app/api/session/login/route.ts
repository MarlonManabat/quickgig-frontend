import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { proxyFetch, cloneHeaders } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }
  const { email, password } = (body || {}) as Record<string, unknown>;
  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400 });
  }

  const headers = cloneHeaders(req.headers);
  headers.set('content-type', 'application/json');

  let upstream: Response;
  try {
    upstream = await proxyFetch(
      `${env.NEXT_PUBLIC_GATE_ORIGIN}${env.GATE_LOGIN_PATH}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
      },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'login failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  if (!upstream.ok) {
    let error = '';
    try {
      const data = (await upstream.json()) as Record<string, unknown>;
      error =
        (typeof data.error === 'string' ? data.error : undefined) ||
        (typeof data.message === 'string' ? data.message : undefined) ||
        '';
    } catch {
      error = await upstream.text().catch(() => '');
    }
    return NextResponse.json(
      { ok: false, error },
      { status: upstream.status },
    );
  }

  const setCookies = upstream.headers.getSetCookie?.() ?? [];
  if (setCookies.length) {
    const res = NextResponse.json({ ok: true });
    for (const c of setCookies) res.headers.append('set-cookie', c);
    return res;
  }

  const json = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
  const token =
    typeof json.token === 'string'
      ? json.token
      : typeof json.access_token === 'string'
      ? (json.access_token as string)
      : undefined;
  if (token) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: env.JWT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: env.JWT_MAX_AGE_SECONDS,
    });
    return res;
  }

  return NextResponse.json({ ok: true });
}
