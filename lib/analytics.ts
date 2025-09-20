'use client';

export function trackEvent(event: string, payload?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Hook up analytics provider here
  }
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', event, payload);
  }
}
