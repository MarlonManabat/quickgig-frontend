import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';
import { setSessionCookie } from '@/lib/cookies';
import { engineLogin } from '@/lib/engineAuth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: 'Missing credentials' },
      { status: 400 },
    );
  }

  const result = await engineLogin(email, password);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message || 'Login failed' },
      { status: 401 },
    );
  }

  const secret = process.env.AUTH_SECRET || '';
  const name = process.env.JWT_COOKIE_NAME || 'auth_token';
  const { token, exp } = signJwt({ sub: email }, secret);
  setSessionCookie(name, token, exp);
  return NextResponse.json({ ok: true });
}

