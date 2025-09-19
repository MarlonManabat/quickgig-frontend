import { defineConfig, devices } from '@playwright/test';

const appOrigin = process.env.APP_ORIGIN;

export default defineConfig({
  testDir: 'tests/smoke',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  workers: 2,
  use: {
    baseURL: appOrigin || 'http://localhost:4010',
    navigationTimeout: 15_000,
    actionTimeout: 12_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(appOrigin
    ? {}
    : {
        webServer: {
          command: 'npm run start:ci',
          port: 4010,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
});
