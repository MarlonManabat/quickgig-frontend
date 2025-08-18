import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/config/env';

const BASE = process.env.ENGINE_BASE_URL || '';

export async function POST(req: NextRequest) {
  if (!cookies().get(env.JWT_COOKIE_NAME)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (BASE) {
    try {
      await fetch(`${BASE}/api/session/logout-all`, {
        method: 'POST',
        headers: { cookie: req.headers.get('cookie') || '' },
      });
    } catch {
      /* ignore */
    }
  }
  const res = NextResponse.json({ ok: true });
  res.headers.append('Set-Cookie', `${env.JWT_COOKIE_NAME}=; Path=/; Max-Age=0`);
  return res;
}
