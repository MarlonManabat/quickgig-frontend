import { defineConfig, devices } from '@playwright/test';

function base() {
  // No new envs. Use what we already have, with safe fallbacks.
  const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (!raw) return 'http://localhost:3000';
  return raw.startsWith('http') ? raw : `https://${raw}`;
}

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  workers: 1,
  use: {
    baseURL: base(),
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    headless: true,
    // IMPORTANT: our app is client-side heavy; avoid waiting for network idle.
    // Tests should use goto with domcontentloaded explicitly.
  },
  reporter: [['html', { open: 'never' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run start:prod',
        url: 'http://localhost:3000',
        timeout: 120_000,
        reuseExistingServer: false,
      },
});
