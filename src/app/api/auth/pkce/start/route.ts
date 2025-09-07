import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUrlSafe, challengeS256 } from '@/lib/pkce';
import { sanitizeNext } from '@/lib/safeNext';
import { crossSiteCookieOpts } from '@/lib/cookieOptions';

const NEXT_COOKIE = 'next';
const STATE_COOKIE = 'pkce_state';
const PKCE_COOKIE = 'pkce_verifier';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const nextParam = url.searchParams.get('next') || undefined;

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

  const store = cookies();
  store.set(NEXT_COOKIE, sanitizeNext(nextParam), { ...crossSiteCookieOpts, maxAge: 300 });
  store.set(STATE_COOKIE, state, { ...crossSiteCookieOpts, maxAge: 300 });
  store.set(PKCE_COOKIE, verifier, { ...crossSiteCookieOpts, maxAge: 300 });

  return NextResponse.redirect(auth.toString(), { status: 302 });
}

