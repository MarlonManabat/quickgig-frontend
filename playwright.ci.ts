import base from './playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...base,
  use: {
    ...base.use,
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    video: 'retain-on-failure',
  },
  reporter: [['github'], ...(base.reporter ?? [])],
};

export default config;
