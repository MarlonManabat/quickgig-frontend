import { NextResponse, NextRequest } from 'next/server';

const LANDING_HOSTS = new Set(['quickgig.ph', 'www.quickgig.ph']);
const APP_HOST_PROD = 'app.quickgig.ph';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;
  const isLandingHost = LANDING_HOSTS.has(url.hostname);
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  const needsApp = path === '/post' || path === '/find' || path === '/login';

  if (isProd && isLandingHost && needsApp) {
    const to = new URL(req.url);
    to.hostname = APP_HOST_PROD;
    return NextResponse.redirect(to, 301);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/post', '/find', '/login'] };
