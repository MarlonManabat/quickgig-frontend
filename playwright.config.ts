import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: {
    command: 'npm run start -- -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'smoke',
      testIgnore: ['tests/e2e/**', '**/full.e2e.*'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'full-e2e',
      testMatch: ['tests/e2e/**', '**/full.e2e.*'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
