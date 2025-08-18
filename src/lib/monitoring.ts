import { env } from '@/config/env';

let inited = false;

export function initMonitoring() {
  if (inited) return;
  inited = true;

  if (!env.NEXT_PUBLIC_ENABLE_MONITORING) return;

  const isMock =
    process.env.ENGINE_MODE !== 'php' &&
    process.env.NEXT_PUBLIC_ENGINE_MODE !== 'php';

  if (typeof window !== 'undefined' && isMock) {
    // eslint-disable-next-line no-console
    console.log('[monitoring] active');
  }

  initSentry();
  initMixpanel(isMock);
  initWebVitals();
  trackEvent('app_loaded');
}

async function initSentry() {
  if (!env.SENTRY_DSN) return;
  try {
    const pkg = '@sentry/nextjs';
    const Sentry = await import(pkg);
    (Sentry as { init?: (opt: Record<string, unknown>) => void }).init?.({
      dsn: env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  } catch {
    // eslint-disable-next-line no-console
    console.warn('[monitoring] sentry unavailable');
  }
}

function initMixpanel(isMock: boolean) {
  if (!env.MIXPANEL_TOKEN) {
    if (isMock && typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[monitoring] mixpanel token missing');
    }
    return;
  }
  const mpPkg = 'mixpanel-browser';
  import(mpPkg)
    .then((m: { init?: (token: string) => void }) => m.init?.(env.MIXPANEL_TOKEN))
    .catch(() => {
      if (isMock && typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn('[monitoring] mixpanel init failed');
      }
    });
}

function initWebVitals() {
    const vitalsPkg = 'web-vitals';
    import(vitalsPkg)
      .then(({ onCLS, onFID, onLCP }) => {
        type VitalsMetric = { name: string; value: number };
        const log = (metric: VitalsMetric) => {
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.log('[monitoring][vitals]', metric.name, metric.value);
          }
        };
        onCLS(log);
        onFID(log);
        onLCP(log);
      })
      .catch(() => {
        /* no-op */
      });
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (!env.NEXT_PUBLIC_ENABLE_MONITORING) return;
  const mp =
    (typeof window !== 'undefined' &&
      (window as unknown as {
        mixpanel?: { track?: (n: string, p?: Record<string, unknown>) => void };
      }).mixpanel) ||
    null;
  if (mp?.track) mp.track(name, props);
  else if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[monitoring][event]', name, props);
  }
}
