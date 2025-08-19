import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/config/env';
import { logoutUpstream } from '@/lib/gateway';

export async function POST() {
  try { await logoutUpstream(); } catch {}
  cookies().set(env.cookieName, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    domain: '.quickgig.ph',
  });
  return NextResponse.json({ ok: true });
}
