import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: 'tests/smoke',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL,
    navigationTimeout: 20_000,
    actionTimeout: 10_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // no webServer; CI starts/stops dev server explicitly
});
