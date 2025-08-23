import { defineConfig } from '@playwright/test'

export default defineConfig({
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: { headless: true, trace: 'on-first-retry' },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  projects: [
    { name: 'smoke', testMatch: /smoke\.spec\.ts$/ },
    { name: 'full-e2e', testMatch: /\.e2e\.spec\.ts$/ }
  ]
})
