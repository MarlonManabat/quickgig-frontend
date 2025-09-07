import { NextResponse } from 'next/server';
import { randomUrlSafe, challengeS256 } from '@/lib/pkce';
import { setCookie } from '@/lib/cookies';

const COOKIE_DOMAIN = '.quickgig.ph';
const PKCE_COOKIE = 'qg_pkce';
const STATE_COOKIE = 'qg_state';
const NEXT_COOKIE = 'qg_next';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/applications';

  const authorizeUrl = process.env.AUTH_AUTHORIZE_URL!;
  const clientId = process.env.AUTH_CLIENT_ID!;
  const appHost = process.env.NEXT_PUBLIC_APP_HOST || 'app.quickgig.ph';
  const redirectPath = process.env.AUTH_REDIRECT_PATH || '/api/auth/pkce/callback';
  const redirectUri = `https://${appHost}${redirectPath}`;

  const verifier = randomUrlSafe(64);
  const challenge = await challengeS256(verifier);
  const state = randomUrlSafe(32);

  const auth = new URL(authorizeUrl);
  auth.searchParams.set('client_id', clientId);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('redirect_uri', redirectUri);
  auth.searchParams.set('code_challenge_method', 'S256');
  auth.searchParams.set('code_challenge', challenge);
  auth.searchParams.set('state', state);

  const res = NextResponse.redirect(auth.toString(), { status: 302 });
  setCookie(res.headers, PKCE_COOKIE, verifier, { domain: COOKIE_DOMAIN, maxAge: 600 });
  setCookie(res.headers, STATE_COOKIE, state, { domain: COOKIE_DOMAIN, maxAge: 600 });
  setCookie(res.headers, NEXT_COOKIE, next, { domain: COOKIE_DOMAIN, maxAge: 600 });

  return res;
}

