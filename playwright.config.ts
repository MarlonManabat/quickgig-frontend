import { defineConfig, devices } from '@playwright/test';

function base() {
  // No new envs. Use what we already have, with safe fallbacks.
  const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (!raw) return 'http://localhost:3000';
  return raw.startsWith('http') ? raw : `https://${raw}`;
}

const basicMode = process.env.E2E_BASIC === '1';

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
  // Skip @auth tests in basic mode
  ...(basicMode ? { grepInvert: /@auth/ } : {}),
  reporter: [['html', { open: 'never' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_WEBSERVER_CMD || 'npm run start',
    url: base(),
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
