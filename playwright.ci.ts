import type { PlaywrightTestConfig, ReporterDescription } from '@playwright/test';
import base from './playwright.base';

const config: PlaywrightTestConfig = {
  ...base,
  retries: 1,
  timeout: 30_000,
  reporter: [
    ['github'],
    ...((base.reporter as ReporterDescription[]) || []),
  ],
  use: {
    ...base.use,
    baseURL: process.env.BASE_URL,
    video: 'retain-on-failure',
  },
};

export default config;
