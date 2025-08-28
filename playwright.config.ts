import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npx next start -p 3000',
        url: 'http://localhost:3000',
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
        env: {
          NEXT_PUBLIC_SUPABASE_URL:
            process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key',
        },
      },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  projects: [
    {
      name: 'smoke',
      testMatch: ['tests/smoke/**/*.spec.ts', '**/*.smoke.ts'],
      timeout: 45_000,
      expect: { timeout: 7_000 },
      use: { baseURL: 'http://localhost:3000' },
    },
    {
      name: 'e2e',
      testMatch: ['tests/e2e/**/*.spec.ts'],
      use: {
        baseURL: 'http://localhost:3000',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
      },
    },
    {
      name: 'clickmap',
      testDir: 'e2e',
      testMatch: /.*\.spec\.ts/,
      timeout: 60_000,
    },
    {
      name: 'qa',
      testDir: 'tests/qa',
      testIgnore: ['ui.*'],
      retries: 2,
      timeout: 60_000,
      use: {
        baseURL: process.env.BASE_URL,
        video: 'on',
        trace: 'on-first-retry',
        screenshot: 'on',
      },
    },
  ],
});
