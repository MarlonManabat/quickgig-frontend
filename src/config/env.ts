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
    String(process.env.NEXT_PUBLIC_ENABLE_INTERVIEWS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_INTERVIEWS_UI:
    String(process.env.NEXT_PUBLIC_ENABLE_INTERVIEWS_UI ?? 'false').toLowerCase() === 'true',
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
    String(process.env.NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER ?? 'false').toLowerCase() === 'true',
  NOTIFS_POLL_MS: parseInt(process.env.NOTIFS_POLL_MS || '30000', 10),
  NOTIFS_PAGE_SIZE: parseInt(process.env.NOTIFS_PAGE_SIZE || '20', 10),
  NEXT_PUBLIC_ENABLE_SOCKETS:
    String(process.env.NEXT_PUBLIC_ENABLE_SOCKETS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_NOTIFY_CENTER:
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
    String(process.env.NEXT_PUBLIC_ENABLE_PAYMENTS ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_GCASH:
    String(process.env.NEXT_PUBLIC_ENABLE_GCASH ?? 'false').toLowerCase() === 'true',
  NEXT_PUBLIC_ENABLE_STRIPE:
    String(process.env.NEXT_PUBLIC_ENABLE_STRIPE ?? 'false').toLowerCase() === 'true',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
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
