import { defineConfig } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ||
             (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default defineConfig({
  forbidOnly: true,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { timeout: 10000 },
  use: {
    baseURL: base,
    trace: 'on-first-retry'
  },
});
