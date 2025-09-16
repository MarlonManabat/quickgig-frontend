import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyticsUrl } from '@/lib/env';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { jobId, href } = (body ?? {}) as { jobId?: string | number; href?: string };
  const payload = {
    t: Date.now(),
    jobId,
    href,
    referer: req.headers.get('referer') || '',
    ua: req.headers.get('user-agent') || '',
  };

  const sink = analyticsUrl();
  if (sink) {
    try {
      await fetch(sink, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ event: 'apply_click', ...payload }),
      });
    } catch {
      // swallow – tracking must never block UX
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('[track/apply]', payload);
  }

  return new NextResponse(null, { status: 204 });
}
