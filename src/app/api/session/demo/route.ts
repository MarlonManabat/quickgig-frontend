import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const COOKIE = process.env.JWT_COOKIE_NAME || 'qg.sid';

export async function POST() {
  if (process.env.NEXT_PUBLIC_DEMO_LOGIN !== '1' || process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  cookies().set({
    name: COOKIE,
    value: 'demo-token',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return NextResponse.json({ ok: true });
}
