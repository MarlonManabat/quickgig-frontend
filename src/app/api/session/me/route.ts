import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export const runtime = 'nodejs';

export async function GET() {
  const name = process.env.JWT_COOKIE_NAME || 'auth_token';
  const t = cookies().get(name)?.value;
  if (!t) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  const data = verifyJwt(t, process.env.AUTH_SECRET || '');
  if (!data) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: { email: data.sub } });
}

