import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/cookies';

export const runtime = 'nodejs';

export async function POST() {
  const name = process.env.JWT_COOKIE_NAME || 'auth_token';
  clearSessionCookie(name);
  return NextResponse.json({ ok: true });
}

