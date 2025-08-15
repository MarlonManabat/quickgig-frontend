import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { proxyFetch } from '@/server/proxy';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const { res, data } = await proxyFetch('/auth/login', {
      method: 'POST',
      body,
      formFallback: true,
    });

    const d = (typeof data === 'object' && data
      ? (data as Record<string, unknown>)
      : {}) as Record<string, unknown>;
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
      const resp = NextResponse.json({ ok: true });
      resp.cookies.set(env.JWT_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return resp;
    }

    const message =
      typeof d['message'] === 'string'
        ? (d['message'] as string)
        : typeof d['error'] === 'string'
          ? (d['error'] as string)
          : 'Invalid email or password';

    return NextResponse.json({ ok: false, message }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Auth service unreachable' },
      { status: 200 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
