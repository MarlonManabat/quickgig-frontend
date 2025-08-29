import { NextResponse, NextRequest } from 'next/server';

const LANDING_HOSTS = new Set(['quickgig.ph', 'www.quickgig.ph']);
const APP_HOST_PROD = 'app.quickgig.ph';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;
  const isCandidate = path === '/post' || path === '/find' || path === '/login';
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  if (isProd && LANDING_HOSTS.has(url.hostname) && isCandidate) {
    const redirect = new URL(req.url);
    redirect.hostname = APP_HOST_PROD;
    return NextResponse.redirect(redirect, 301);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/post', '/find', '/login'] };
