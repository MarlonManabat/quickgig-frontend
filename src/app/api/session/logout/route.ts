import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { proxyFetch, cloneHeaders } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(env.JWT_COOKIE_NAME)?.value;
  const headers = cloneHeaders(req.headers);
  if (token) {
    headers.set('cookie', req.headers.get('cookie') || '');
    headers.set('authorization', `Bearer ${token}`);
    try {
      await proxyFetch(
        `${env.NEXT_PUBLIC_GATE_ORIGIN}${env.GATE_LOGOUT_PATH}`,
        { method: 'POST', headers },
      );
    } catch {
      /* ignore */
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: env.JWT_COOKIE_NAME, value: '', path: '/', maxAge: 0 });
  return res;
}
