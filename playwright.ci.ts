import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...(baseConfig as any),
  reporter: [
    ['github'],
    ['html', { outputFolder: 'playwright-report' }],
  ],
  timeout: 60_000,
  use: {
    ...((baseConfig as any)?.use ?? {}),
    baseURL: process.env.BASE_URL,
    video: 'retain-on-failure',
  },
});

