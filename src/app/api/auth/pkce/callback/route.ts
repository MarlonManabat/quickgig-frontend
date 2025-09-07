import { NextResponse } from 'next/server';
import { clearCookie, readCookieFromRequest } from '@/lib/cookies';

const COOKIE_DOMAIN = '.quickgig.ph';
const PKCE_COOKIE = 'qg_pkce';
const STATE_COOKIE = 'qg_state';
const NEXT_COOKIE = 'qg_next';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const savedState = readCookieFromRequest(req, STATE_COOKIE);
  const verifier = readCookieFromRequest(req, PKCE_COOKIE);
  const next = readCookieFromRequest(req, NEXT_COOKIE) || '/applications';

  if (!code || !state || !verifier || !savedState || state !== savedState) {
    const retry = new URL('/auth/confirming', url.origin);
    retry.searchParams.set('error', 'session');
    retry.searchParams.set('next', next);
    return NextResponse.redirect(retry.toString(), { status: 302 });
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
    const retry = new URL('/auth/confirming', url.origin);
    retry.searchParams.set('error', 'exchange');
    retry.searchParams.set('next', next);
    return NextResponse.redirect(retry.toString(), { status: 302 });
  }

  const tokens = await resToken.json();
  // TODO: set your app session here (existing mechanism)
  // e.g., setCookie(response.headers, 'qg_session', tokens.access_token, { domain: COOKIE_DOMAIN, ... })

  const redirect = NextResponse.redirect(new URL(next, url.origin).toString(), { status: 302 });
  clearCookie(redirect.headers, PKCE_COOKIE, COOKIE_DOMAIN);
  clearCookie(redirect.headers, STATE_COOKIE, COOKIE_DOMAIN);
  clearCookie(redirect.headers, NEXT_COOKIE, COOKIE_DOMAIN);

  return redirect;
}

