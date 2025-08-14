// @ts-nocheck
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: process.env.BASE ?? 'https://quickgig.ph',
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['html'],
    ['junit', { outputFile: './reports/junit.xml' }]
  ],
  projects: [{ name: 'prod' }]
});
