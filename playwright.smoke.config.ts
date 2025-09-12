import { defineConfig, devices } from '@playwright/test';

const appOrigin = process.env.APP_ORIGIN;
const port = process.env.PORT || String(3000 + Math.floor(Math.random() * 1000));

export default defineConfig({
  testDir: 'tests/smoke',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: appOrigin || `http://localhost:${port}`,
    navigationTimeout: 20_000,
    actionTimeout: 10_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(appOrigin
    ? {}
    : {
        webServer: {
          command: `PORT=${port} npm start`,
          port: Number(port),
          reuseExistingServer: !process.env.CI,
        },
      }),
});
