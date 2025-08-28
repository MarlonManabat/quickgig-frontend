import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: /.*\.spec\.ts/,
  timeout: 60_000,
});

