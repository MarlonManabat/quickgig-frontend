import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/config/env';

const BASE = process.env.ENGINE_BASE_URL || '';

export async function DELETE(req: NextRequest) {
  if (!cookies().get(env.cookieName)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (BASE) {
    try {
      await fetch(`${BASE}/api/account`, {
        method: 'DELETE',
        headers: { cookie: req.headers.get('cookie') || '' },
      });
    } catch {
      /* ignore */
    }
  }
  const res = NextResponse.json({ ok: true }, { status: 202 });
  res.headers.append('Set-Cookie', `${env.cookieName}=; Path=/; Max-Age=0`);
  res.headers.append('Set-Cookie', `settings_v1=; Path=/; Max-Age=0`);
  return res;
}
