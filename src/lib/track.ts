'use client';
import { env } from '@/config/env';
import { getSessionId } from './sessionId';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function track(event: string, props: Record<string, any> = {}) {
  if (!env.NEXT_PUBLIC_ENABLE_ANALYTICS) return;
  try {
    const body = JSON.stringify({
      event,
      props,
      sessionId: getSessionId(),
      ref: typeof document !== 'undefined' ? document.referrer || '' : '',
    });
    const url = '/api/metrics/track';
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }).catch(() => {});
    }
  } catch {
    // swallow
  }
}
