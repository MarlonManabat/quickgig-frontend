import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // ignore bad JSON
  }

  // Optional forward to external analytics sink if configured.
  const forwardUrl =
    process.env.ANALYTICS_INGEST_URL || process.env.APPLY_TRACK_URL || '';
  if (forwardUrl) {
    try {
      await fetch(forwardUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body ?? {}),
        cache: 'no-store',
      });
    } catch {
      // swallow; tracking must never break UX or tests
    }
  } else {
    // Useful in CI / dev logs
    // eslint-disable-next-line no-console
    console.log('[track]', body);
  }

  return new NextResponse(null, { status: 204 });
}
