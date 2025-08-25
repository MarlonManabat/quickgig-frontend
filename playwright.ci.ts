import type { ReporterDescription, PlaywrightTestConfig } from '@playwright/test';
import base from './playwright.config';

const ciReporters: ReporterDescription[] = [['github']];

const config: PlaywrightTestConfig = {
  ...base,
  use: {
    ...base.use,
    video: 'retain-on-failure',
  },
  reporter: [
    ...ciReporters,
    ...(Array.isArray(base.reporter)
      ? base.reporter
      : base.reporter
        ? [base.reporter]
        : []),
  ],
};

export default config;
