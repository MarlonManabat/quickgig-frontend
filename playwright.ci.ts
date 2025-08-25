import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  // Inherit anything defined in the base config if present
  ...(baseConfig as any),
  reporter: [['github'], ...((baseConfig as any)?.reporter ?? [])],
  use: {
    ...((baseConfig as any)?.use ?? {}),
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
