// Lightweight client-side tracking with sendBeacon (non-blocking).
// Falls back to a keepalive fetch. Never throws.
type AnyRecord = Record<string, unknown>;

function postBeacon(url: string, body: AnyRecord) {
  try {
    const data = JSON.stringify(body);
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([data], { type: 'application/json' });
      // @ts-expect-error: TS doesn't know sendBeacon type in some DOM libs
      navigator.sendBeacon(url, blob);
      return;
    }
    // keepalive avoids blocking navigation on page transitions
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: data,
      keepalive: true,
      cache: 'no-store',
    }).catch(() => {});
  } catch {
    // no-op
  }
}

/** Generic event tracker */
export function track(event: string, payload: AnyRecord = {}) {
  const url =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_URL) ||
    '/api/track';
  const ts = Date.now();
  const path =
    typeof location !== 'undefined' ? location.pathname + location.search : '';
  postBeacon(url, { event, ts, path, ...payload });
}

/** Convenience helper for Apply clicks */
export function trackApply(job: { id: string | number; title?: string }) {
  track('apply_click', {
    jobId: String(job?.id ?? ''),
    title: job?.title ?? '',
  });
}
