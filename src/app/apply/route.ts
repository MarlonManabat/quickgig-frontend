import { NextResponse } from 'next/server';

/**
 * Server-side apply click handler:
 * - records the application metadata via the existing API
 * - then redirects to the provided `next` destination (login or external apply URL)
 *
 * Works without client JS and inside CI/preview.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next') || '/';
  const jobId = url.searchParams.get('jobId');
  const title = url.searchParams.get('title') ?? '';

  try {
    if (jobId) {
      await fetch(new URL('/api/applications/record', url.origin), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ id: Number(jobId), title }),
      });
    }
  } catch (error) {
    console.warn('[apply] failed to record application:', (error as Error).message);
  }

  return NextResponse.redirect(next, 302);
}
