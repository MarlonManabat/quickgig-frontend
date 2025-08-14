import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  retries: 0,
  reporter: [ ['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }] ],
  use: {
    baseURL: process.env.BASE || 'https://app.quickgig.ph',
    headless: true,
  },
});
