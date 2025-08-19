const BETA =
  String(process.env.NEXT_PUBLIC_ENABLE_BETA_RELEASE ?? 'false').toLowerCase() ===
  'true';

export const env = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph',
  API_URL:
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph',
  NEXT_PUBLIC_GATE_ORIGIN: process.env.NEXT_PUBLIC_GATE_ORIGIN || '',
  GATE_LOGIN_PATH: process.env.GATE_LOGIN_PATH || '/auth/login',
  GATE_ME_PATH: process.env.GATE_ME_PATH || '/auth/me',
  GATE_LOGOUT_PATH: process.env.GATE_LOGOUT_PATH || '/auth/logout',
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'qg_session',
  JWT_MAX_AGE_SECONDS: parseInt(
    process.env.JWT_MAX_AGE_SECONDS || '1209600',
    10,
  ),
  NEXT_PUBLIC_ENABLE_BETA_RELEASE: BETA,
  NEXT_PUBLIC_ENABLE_APPLY:
    String(process.env.NEXT_PUBLIC_ENABLE_APPLY ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_SAVED_API:
    String(process.env.NEXT_PUBLIC_ENABLE_SAVED_API ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_SHOW_LOGOUT_ALL:
    String(process.env.NEXT_PUBLIC_SHOW_LOGOUT_ALL ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_APP_SHELL_V2:
    String(process.env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2 ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_APPLICANT_APPS:
    String(process.env.NEXT_PUBLIC_ENABLE_APPLICANT_APPS ?? 'true').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT:
    String(process.env.NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT ?? 'false').toLowerCase() === 'true',

  NEXT_PUBLIC_ENABLE_ENGINE_AUTH:
    String(process.env.NEXT_PUBLIC_ENABLE_ENGINE_AUTH ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_ENGINE_PROFILE:
    String(process.env.NEXT_PUBLIC_ENABLE_ENGINE_PROFILE ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_ENGINE_APPS:
    String(process.env.NEXT_PUBLIC_ENABLE_ENGINE_APPS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_ENGINE_APPLY:
    String(process.env.NEXT_PUBLIC_ENABLE_ENGINE_APPLY ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_SETTINGS:
    String(process.env.NEXT_PUBLIC_ENABLE_SETTINGS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_DEFAULT_LANG:
    (process.env.NEXT_PUBLIC_DEFAULT_LANG as 'en' | 'tl') || 'en',
  NEXT_PUBLIC_DEFAULT_EMAIL_PREFS:
    (process.env.NEXT_PUBLIC_DEFAULT_EMAIL_PREFS as 'ops_only' | 'all' | 'none') || 'ops_only',
  NEXT_PUBLIC_DEFAULT_ALERTS_FREQUENCY:
    (process.env.NEXT_PUBLIC_DEFAULT_ALERTS_FREQUENCY as 'off' | 'daily' | 'weekly') || 'weekly',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  NOTIFY_FROM: process.env.NOTIFY_FROM || 'QuickGig <noreply@quickgig.ph>',
  NOTIFY_ADMIN_EMAIL: process.env.NOTIFY_ADMIN_EMAIL || '',
  NEXT_PUBLIC_ENABLE_EMAILS:
    BETA || String(process.env.NEXT_PUBLIC_ENABLE_EMAILS ?? 'false').toLowerCase() === 'true',
  EMPLOYER_EMAILS:
    process.env.EMPLOYER_EMAILS?.split(',').map((e) => e.trim()).filter(Boolean) || [],
  ALERTS_DIGEST_SECRET: process.env.ALERTS_DIGEST_SECRET || '',
  NEXT_PUBLIC_ENABLE_ALERTS:
    String(process.env.NEXT_PUBLIC_ENABLE_ALERTS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_REPORTS:
    String(process.env.NEXT_PUBLIC_ENABLE_REPORTS ?? 'true').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_ADMIN:
    String(process.env.NEXT_PUBLIC_ENABLE_ADMIN ?? 'true').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_JOB_VIEWS:
    String(process.env.NEXT_PUBLIC_ENABLE_JOB_VIEWS ?? 'true').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_EMPLOYER_PROFILES:
    String(process.env.NEXT_PUBLIC_ENABLE_EMPLOYER_PROFILES ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_JOB_DRAFTS:
    String(process.env.NEXT_PUBLIC_ENABLE_JOB_DRAFTS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_FILE_SIGNING:
    String(process.env.NEXT_PUBLIC_ENABLE_FILE_SIGNING ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_APPLICATION_DETAIL:
    String(process.env.NEXT_PUBLIC_ENABLE_APPLICATION_DETAIL ?? 'true').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_EMPLOYER_APPLICANT_DRILLDOWN:
    String(process.env.NEXT_PUBLIC_ENABLE_EMPLOYER_APPLICANT_DRILLDOWN ?? 'true').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_INTERVIEWS:
    BETA || String(process.env.NEXT_PUBLIC_ENABLE_INTERVIEWS ?? 'false').toLowerCase() ===
    'true',
  NEXT_PUBLIC_ENABLE_INTERVIEWS_UI:
    String(process.env.NEXT_PUBLIC_ENABLE_INTERVIEWS_UI ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES:
    BETA ||
    String(process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES ?? 'false').toLowerCase() ===
      'true',
  NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS:
    BETA ||
    String(process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS ?? 'false').toLowerCase() ===
      'true',
  NEXT_PUBLIC_INTERVIEW_DEFAULT_METHOD:
    (process.env.NEXT_PUBLIC_INTERVIEW_DEFAULT_METHOD as 'video' | 'phone' | 'in_person') || 'video',
  NEXT_PUBLIC_INTERVIEW_SLOT_MINUTES:
    parseInt(process.env.NEXT_PUBLIC_INTERVIEW_SLOT_MINUTES || '30', 10),
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  NEXT_PUBLIC_ENABLE_ANALYTICS:
    String(process.env.NEXT_PUBLIC_ENABLE_ANALYTICS ?? 'true').toLowerCase() === 'true',
  METRICS_SECRET: process.env.METRICS_SECRET || '',
  ALERTS_WEBHOOK_URL: process.env.ALERTS_WEBHOOK_URL || '',
  NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER:
    BETA ||
    String(process.env.NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER ?? 'false').toLowerCase() ===
      'true',
  NOTIFS_POLL_MS: parseInt(process.env.NOTIFS_POLL_MS || '30000', 10),
  NOTIFS_PAGE_SIZE: parseInt(process.env.NOTIFS_PAGE_SIZE || '20', 10),
  NEXT_PUBLIC_ENABLE_SOCKETS:
    String(process.env.NEXT_PUBLIC_ENABLE_SOCKETS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_NOTIFY_CENTER:
    BETA ||
    String(process.env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_NOTIFY_SRC_MESSAGES:
    String(process.env.NEXT_PUBLIC_NOTIFY_SRC_MESSAGES ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_NOTIFY_SRC_INTERVIEWS:
    String(process.env.NEXT_PUBLIC_NOTIFY_SRC_INTERVIEWS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_NOTIFY_SRC_ALERTS:
    String(process.env.NEXT_PUBLIC_NOTIFY_SRC_ALERTS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_NOTIFY_SRC_ADMIN:
    String(process.env.NEXT_PUBLIC_NOTIFY_SRC_ADMIN ?? 'false').toLowerCase() === 'true',
  EVENTS_POLL_MS: parseInt(process.env.EVENTS_POLL_MS || '5000', 10),
  NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT:
    String(process.env.NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_BULK_REJECTION_EMAILS:
    String(process.env.NEXT_PUBLIC_ENABLE_BULK_REJECTION_EMAILS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA:
    String(process.env.NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_NOTIFY_CENTER_QA:
    String(process.env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER_QA ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_LINK_MAP_SANITY:
    String(process.env.NEXT_PUBLIC_ENABLE_LINK_MAP_SANITY ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_STATUS_PAGE:
    String(process.env.NEXT_PUBLIC_ENABLE_STATUS_PAGE ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_SECURITY_AUDIT:
    String(process.env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_I18N_POLISH:
    String(process.env.NEXT_PUBLIC_ENABLE_I18N_POLISH ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_PAYMENTS:
    BETA || String(process.env.NEXT_PUBLIC_ENABLE_PAYMENTS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_GCASH:
    String(process.env.NEXT_PUBLIC_ENABLE_GCASH ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_STRIPE:
    String(process.env.NEXT_PUBLIC_ENABLE_STRIPE ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE:
    String(process.env.NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE ?? 'false').toLowerCase() === 'true',
  STRIPE_TEST_PUBLISHABLE_KEY: process.env.STRIPE_TEST_PUBLISHABLE_KEY || '',
  STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  GCASH_MERCHANT_ID: process.env.GCASH_MERCHANT_ID || '',
  GCASH_API_KEY: process.env.GCASH_API_KEY || '',
  NEXT_PUBLIC_ENABLE_MONITORING:
    String(process.env.NEXT_PUBLIC_ENABLE_MONITORING ?? 'false').toLowerCase() === 'true',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN || '',
};
// In dev, warn about missing values (never throw in production)
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.NEXT_PUBLIC_API_URL && !process.env.API_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      '[env] NEXT_PUBLIC_API_URL / API_URL not set. Using https://api.quickgig.ph'
    );
  }
  if (!process.env.NEXT_PUBLIC_GATE_ORIGIN) {
    // eslint-disable-next-line no-console
    console.warn('[env] NEXT_PUBLIC_GATE_ORIGIN not set');
  }
}
