import { defineConfig, devices } from '@playwright/test';

function resolveBaseURL() {
  const raw = process.env.BASE_URL || '';
  if (raw) return raw.startsWith('http') ? raw : `http://${raw}`;
  return 'http://localhost:3000';
}

const baseURL = resolveBaseURL();

// Only start a local server when targeting localhost.
const isRemote = /^https?:\/\/(?!localhost|127\.0\.0\.1)/i.test(baseURL);
const serverCmd = process.env.PLAYWRIGHT_WEBSERVER_CMD || 'npm run start';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(isRemote
    ? {}
    : {
        webServer: {
          command: serverCmd,
          port: 3000,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
});
