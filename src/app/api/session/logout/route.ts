import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { gateway } from '@/lib/gateway';
import { copySetCookie } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST() {
  let upstream: Response;
  try {
    upstream = await gateway('/auth/logout', { method: 'POST', cache: 'no-store' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[logout]', 500, msg.slice(0, 100));
    const res = NextResponse.json(
      { ok: false, error: msg, status: 500 },
      { status: 500 },
    );
    res.cookies.set({
      name: env.JWT_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return res;
  }
  const cookieInit = copySetCookie(upstream);
  if (upstream.ok) {
    const res = new NextResponse(null, { ...cookieInit, status: 204 });
    res.cookies.set({
      name: env.JWT_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return res;
  }
  const text = await upstream.text();
  console.error('[logout]', upstream.status, text.slice(0, 100));
  const res = NextResponse.json(
    { ok: false, error: text, status: upstream.status },
    { ...cookieInit, status: upstream.status },
  );
  res.cookies.set({
    name: env.JWT_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
