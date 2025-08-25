export function env(key: string, fallback: string): string {
  const v = process.env[key];
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

export const APP_URL = env('NEXT_PUBLIC_APP_URL', 'https://app.quickgig.ph');
export const LANDING_URL = env('NEXT_PUBLIC_LANDING_URL', 'https://quickgig.ph');
export const TEST_EMAIL = env('QA_TEST_EMAIL', 'qa+smoke@quickgig.ph');
export const TEST_EMAIL_ADMIN = env('QA_TEST_EMAIL_ADMIN', TEST_EMAIL);
