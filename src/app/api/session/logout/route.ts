import { NextResponse } from 'next/server';
import { env } from '@/config/env';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(env.JWT_COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
