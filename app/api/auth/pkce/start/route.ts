import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next') ?? '/browse-jobs';
  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'http://localhost:3000';
  const redirectUrl = new URL('/login', origin);
  redirectUrl.searchParams.set('next', next);
  return NextResponse.redirect(redirectUrl);
}
