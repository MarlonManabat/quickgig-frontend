import type { PlaywrightTestConfig, ReporterDescription } from '@playwright/test';

const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_LANDING_URL ||
  'http://localhost:3000';

const isCI = !!process.env.CI;

const reporters: ReporterDescription[] = [
  ['html', { outputFolder: 'playwright-report' }],
];

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: isCI ? 30_000 : 60_000,
  expect: { timeout: isCI ? 20_000 : 10_000 },
  retries: isCI ? 1 : 0,
  use: {
    headless: true,
    trace: 'on-first-retry',
    baseURL,
    actionTimeout: isCI ? 15_000 : 10_000,
    navigationTimeout: isCI ? 30_000 : 15_000,
  },
  reporter: reporters,
};

export default config;
