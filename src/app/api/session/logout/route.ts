import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  console.info('POST /api/session/logout');
  const res = NextResponse.json({ ok: true });
  clearAuthCookie(res);
  console.info('POST /api/session/logout 200');
  return res;
}
