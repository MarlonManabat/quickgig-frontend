import { NextResponse } from 'next/server';

import { hostAware } from '@/lib/hostAware';

export function GET(request: Request) {
  const destination = hostAware('/gigs/create');
  const target = new URL(destination, request.url);
  return NextResponse.redirect(target, 302);
}
