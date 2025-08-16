import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionFromCookies } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  console.info('GET /api/session/me');
  const session = getSessionFromCookies(cookies());
  if (!session.user) {
    console.info('GET /api/session/me 401');
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  console.info('GET /api/session/me 200');
  return NextResponse.json({ ok: true, user: session.user }, { status: 200 });
}
