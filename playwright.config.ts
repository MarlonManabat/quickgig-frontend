import { defineConfig, devices } from '@playwright/test';

function resolveBaseURL() {
  const raw = process.env.BASE_URL || '';
  if (raw) return raw.startsWith('http') ? raw : `http://${raw}`;
  return 'http://localhost:3000';
}

const baseURL = resolveBaseURL();

// If provided, we will start that command; otherwise default to prod-like start.
const serverCmd = process.env.PLAYWRIGHT_WEBSERVER_CMD || 'npm run start';
const useWebServer = true; // keep webServer enabled; command & url are now correct.

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
  ...(useWebServer
    ? {
        webServer: {
          command: serverCmd,
          url: baseURL,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }
    : {}),
});
