export const APP_ORIGIN =
  process.env.APP_ORIGIN ||
  process.env.NEXT_PUBLIC_APP_ORIGIN ||
  'https://app.quickgig.ph';

export const MARKETING_HOST =
  process.env.MARKETING_HOST || 'https://quickgig.ph';

export const QA = {
  mode: (process.env.QA_TEST_MODE || '').toLowerCase() === 'true',
  email: process.env.QA_TEST_EMAIL || '',
  secret: process.env.QA_TEST_SECRET || '',
};
