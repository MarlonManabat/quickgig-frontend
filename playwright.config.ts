import { defineConfig, devices } from '@playwright/test';

function base() {
  const raw =
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL;
  if (!raw) return 'http://localhost:3000';
  return raw.startsWith('http') ? raw : `https://${raw}`;
}

const resolved = base();
const isRemote = (() => {
  try {
    const u = new URL(resolved);
    return !['localhost', '127.0.0.1', '0.0.0.0'].includes(u.hostname);
  } catch {
    return false;
  }
})();

const basicMode = process.env.E2E_BASIC === '1';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: resolved,
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  ...(basicMode ? { grepInvert: /@auth/ } : {}),
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Only start a local server when target is local
  ...(isRemote
    ? {}
    : {
        webServer: {
          command: process.env.PLAYWRIGHT_WEBSERVER_CMD || 'npm run start',
          url: resolved,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
});
