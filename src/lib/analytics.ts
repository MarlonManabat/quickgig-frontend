'use client';
export async function track(event: string, props?: Record<string, unknown>) {
  try {
    const consent = typeof window !== 'undefined' ? localStorage.getItem('consent') : 'denied';
    const url = process.env.NEXT_PUBLIC_ANALYTICS_WEBHOOK;
    if (consent === 'granted' && url) {
      fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ts: Date.now(), event, props }),
      }).catch(() => {});
    } else {
      // eslint-disable-next-line no-console
      console.debug('track', event, props);
    }
  } catch {
    // ignore
  }
}
