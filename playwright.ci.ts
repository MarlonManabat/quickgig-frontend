import { defineConfig } from '@playwright/test';
import base from './playwright.config';

const config = defineConfig({
  ...base,
  // Only overrides specific to CI
  use: {
    ...base.use,
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  // IMPORTANT: reporters must be tuples, not raw strings
  reporter: [
    ['github'],
    ...(Array.isArray((base as any).reporter) ? (base as any).reporter : []),
  ],
});

export default config;
