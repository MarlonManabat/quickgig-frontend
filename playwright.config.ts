import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE || 'https://app.quickgig.ph';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: 2,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'junit.xml' }],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  outputDir: 'test-results',
});
