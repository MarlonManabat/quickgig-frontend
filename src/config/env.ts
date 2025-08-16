export const env = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph',
  API_URL:
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph',
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'auth_token',
  NEXT_PUBLIC_ENABLE_APPLY:
    String(process.env.NEXT_PUBLIC_ENABLE_APPLY ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_SAVED_API:
    String(process.env.NEXT_PUBLIC_ENABLE_SAVED_API ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_SHOW_LOGOUT_ALL:
    String(process.env.NEXT_PUBLIC_SHOW_LOGOUT_ALL ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_LEGACY_UI:
    String(process.env.NEXT_PUBLIC_LEGACY_UI ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_LEGACY_STRICT_SHELL:
    String(process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_SHOW_API_BADGE:
    String(process.env.NEXT_PUBLIC_SHOW_API_BADGE ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_BANNER_HTML: process.env.NEXT_PUBLIC_BANNER_HTML || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  NOTIFY_FROM: process.env.NOTIFY_FROM || 'QuickGig <noreply@quickgig.ph>',
  NOTIFY_ADMIN_EMAIL: process.env.NOTIFY_ADMIN_EMAIL || '',
  EMPLOYER_EMAILS:
    process.env.EMPLOYER_EMAILS?.split(',').map((e) => e.trim()).filter(Boolean) || [],
  ALERTS_DIGEST_SECRET: process.env.ALERTS_DIGEST_SECRET || '',
  NEXT_PUBLIC_ENABLE_ALERTS:
    String(process.env.NEXT_PUBLIC_ENABLE_ALERTS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_REPORTS:
    String(process.env.NEXT_PUBLIC_ENABLE_REPORTS ?? 'true').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_ADMIN:
    String(process.env.NEXT_PUBLIC_ENABLE_ADMIN ?? 'true').toLowerCase() === 'true',
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  NEXT_PUBLIC_ENABLE_ANALYTICS:
    String(process.env.NEXT_PUBLIC_ENABLE_ANALYTICS ?? 'true').toLowerCase() === 'true',
  METRICS_SECRET: process.env.METRICS_SECRET || '',
};
// In dev, warn about missing values (never throw in production)
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.NEXT_PUBLIC_API_URL && !process.env.API_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      '[env] NEXT_PUBLIC_API_URL / API_URL not set. Using https://api.quickgig.ph'
    );
  }
}
