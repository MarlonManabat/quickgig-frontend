import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  reporter: 'line',
  projects: [
    {
      name: 'smoke',
      testMatch: /smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'clickmap',
      testMatch: /clickmap\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
