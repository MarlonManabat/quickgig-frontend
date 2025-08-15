/* eslint-disable @typescript-eslint/no-require-imports */
const pkg = '@sentry/nextjs';
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const Sentry = require(pkg);
    Sentry.init({ dsn, tracesSampleRate: 1.0 });
  } catch {
    // ignore missing Sentry
  }
}

export {};
