import { defineConfig } from '@playwright/test'

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  use: {
    headless: true,
    trace: 'on-first-retry',
    baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  projects: [
    { name: 'smoke', testMatch: /smoke\.spec\.ts$/ },
    { name: 'full-e2e', testMatch: /(?:\.e2e\.spec\.ts|full\.e2e.*\.spec\.ts)$/ }
  ]
})
