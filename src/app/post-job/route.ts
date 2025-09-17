import { NextResponse } from 'next/server';

import { hostAware } from '@/lib/hostAware';

// Legacy QuickGig route: /post-job
// Redirect to app host's job creation page without auth gating.
export function GET(request: Request) {
  const destination = hostAware('/gigs/create');
  const target = new URL(destination, request.url);
  return NextResponse.redirect(target, 302);
}
