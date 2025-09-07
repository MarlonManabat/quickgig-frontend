import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/applications';
  const appHost = process.env.NEXT_PUBLIC_APP_HOST || 'app.quickgig.ph';
  const start = new URL(`https://${appHost}/api/auth/pkce/start`);
  start.searchParams.set('next', next);
  return NextResponse.redirect(start.toString(), { status: 302 });
}

