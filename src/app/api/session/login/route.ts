import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { parseSafe } from '@/server/proxy';

export async function POST(req: Request) {
  console.info('POST /api/session/login');
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(`${env.API_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const data = await parseSafe(res);
    const d =
      typeof data === 'object' && data
        ? (data as Record<string, unknown>)
        : ({} as Record<string, unknown>);
    const token =
      typeof d['token'] === 'string'
        ? (d['token'] as string)
        : typeof d['accessToken'] === 'string'
          ? (d['accessToken'] as string)
          : typeof d['jwt'] === 'string'
            ? (d['jwt'] as string)
            : typeof d['data'] === 'object' && d['data'] !== null &&
                typeof (d['data'] as Record<string, unknown>)['token'] === 'string'
              ? ((d['data'] as Record<string, unknown>)['token'] as string)
              : '';
    if (res.ok && token) {
      const resp = NextResponse.json({ ok: true }, { status: res.status });
      resp.cookies.set(env.JWT_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      console.info('POST /api/session/login', res.status);
      return resp;
    }
    const message =
      typeof d['message'] === 'string'
        ? (d['message'] as string)
        : typeof d['error'] === 'string'
          ? (d['error'] as string)
          : 'Invalid email or password';
    console.info('POST /api/session/login', res.status, message);
    return NextResponse.json({ ok: false, message }, { status: res.status });
  } catch (err) {
    console.info('POST /api/session/login error', err);
    return NextResponse.json(
      { ok: false, message: 'Auth service unreachable' },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}

