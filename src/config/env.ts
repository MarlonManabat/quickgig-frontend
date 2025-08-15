export const env = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  API_URL:
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001',
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'auth_token',
  EMPLOYER_EMAILS:
    process.env.EMPLOYER_EMAILS?.split(',').map((e) => e.trim()).filter(Boolean) || [],
  NEXT_PUBLIC_ENABLE_APPLY:
    process.env.NEXT_PUBLIC_ENABLE_APPLY !== undefined
      ? String(process.env.NEXT_PUBLIC_ENABLE_APPLY).toLowerCase() === 'true'
      : process.env.NODE_ENV !== 'production',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  NOTIFY_FROM: process.env.NOTIFY_FROM || '',
  NOTIFY_ADMIN_EMAIL: process.env.NOTIFY_ADMIN_EMAIL || '',
};
// In dev, warn about missing values (never throw in production)
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.NEXT_PUBLIC_API_URL && !process.env.API_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      '[env] NEXT_PUBLIC_API_URL / API_URL not set. Using http://localhost:3001'
    );
  }
}
