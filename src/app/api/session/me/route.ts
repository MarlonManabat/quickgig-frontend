import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export const runtime = 'nodejs';

export async function GET() {
  const name = process.env.JWT_COOKIE_NAME || 'auth_token';
  const token = cookies().get(name)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Try asking the engine for profile info
  try {
    const res = await fetch(`${process.env.ENGINE_BASE_URL}/me`, {
      headers: { Cookie: `${name}=${token}` },
    });
    if (res.ok) {
      const profile = await res.json().catch(() => null);
      if (profile) return NextResponse.json({ authenticated: true, profile });
    }
  } catch {
    // ignore engine failures and fall back to local session
  }

  const data = verifyJwt(token, process.env.AUTH_SECRET || '') as { email?: string } | null;
  const email = data?.email || '';
  return NextResponse.json({ authenticated: true, profile: { email } });
}
