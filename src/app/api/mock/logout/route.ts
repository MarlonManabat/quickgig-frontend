import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, NEXT_COOKIE } from '@/lib/constants';
import { cookieDomainFor } from '@/lib/auth/cookies';

function resolveNext(req: NextRequest): URL {
  const { origin } = req.nextUrl;
  const target = req.nextUrl.searchParams.get('next') ?? '/';
  let dest: URL;
  try {
    dest = new URL(target, origin);
  } catch {
    dest = new URL('/', origin);
  }
  if (dest.origin !== origin) {
    return new URL('/', origin);
  }
  return dest;
}

function handle(req: NextRequest) {
  const redirectTo = resolveNext(req);
  const res = NextResponse.redirect(redirectTo);
  const domain = cookieDomainFor(req.nextUrl.hostname);
  const base = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    ...(domain ? { domain } : {}),
  };
  [AUTH_COOKIE, 'sb-access-token', 'sb-refresh-token', NEXT_COOKIE].forEach((name) => {
    res.cookies.set({
      name,
      value: '',
      ...base,
    });
  });
  return res;
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}
