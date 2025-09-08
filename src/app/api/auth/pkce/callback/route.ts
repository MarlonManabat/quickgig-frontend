import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { crossSiteCookieOpts } from '@/lib/cookieOptions';

const COOKIE = 'qg_next';
const STATE_COOKIE = 'pkce_state';
const PKCE_COOKIE = 'pkce_verifier';

function clearAuthCookies() {
  const c = cookies();
  const gone = { ...crossSiteCookieOpts, maxAge: 0 };
  c.set(COOKIE, '', gone);
  c.set(STATE_COOKIE, '', gone);
  c.set(PKCE_COOKIE, '', gone);
}

function consumeNext(): string {
  const jar = cookies();
  const v = jar.get(COOKIE)?.value;
  if (v) jar.delete(COOKIE);
  return typeof v === 'string' && v.startsWith('/') ? v : '/applications';
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  const c = cookies();
  const savedState = c.get(STATE_COOKIE)?.value || '';
  const verifier = c.get(PKCE_COOKIE)?.value || '';

  if (!code || !verifier || !returnedState || returnedState !== savedState) {
    clearAuthCookies();
    return NextResponse.redirect(new URL(`/auth/error?reason=invalid_oauth`, url.origin), { status: 302 });
  }

  const tokenUrl = process.env.AUTH_TOKEN_URL!;
  const clientId = process.env.AUTH_CLIENT_ID!;
  const appHost = process.env.NEXT_PUBLIC_APP_HOST || 'app.quickgig.ph';
  const redirectPath = process.env.AUTH_REDIRECT_PATH || '/api/auth/pkce/callback';
  const redirectUri = `https://${appHost}${redirectPath}`;

  const resToken = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri,
    }),
  });

  if (!resToken.ok) {
    clearAuthCookies();
    return NextResponse.redirect(new URL(`/auth/error?reason=unexpected_error`, url.origin), { status: 302 });
  }

  const tokens = await resToken.json();
  // TODO: set your app session here (existing mechanism)

  clearAuthCookies();
  const target = consumeNext();
  return NextResponse.redirect(
    new URL(target, process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.quickgig.ph'),
    { status: 302 },
  );
}

