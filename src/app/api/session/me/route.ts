import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { proxyFetch, cloneHeaders } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const headers = cloneHeaders(req.headers);
  headers.set('cookie', req.headers.get('cookie') || '');
  headers.set('authorization', `Bearer ${token}`);

  let upstream: Response;
  try {
    upstream = await proxyFetch(
      `${env.NEXT_PUBLIC_GATE_ORIGIN}${env.GATE_ME_PATH}`,
      { headers },
    );
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  if (upstream.status === 401 || upstream.status === 403) {
    const res = NextResponse.json({ ok: false }, { status: 401 });
    res.cookies.set({
      name: env.JWT_COOKIE_NAME,
      value: '',
      path: '/',
      maxAge: 0,
    });
    return res;
  }

  if (!upstream.ok) {
    return NextResponse.json({ ok: false }, { status: upstream.status });
  }

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data);
}
