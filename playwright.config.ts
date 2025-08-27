import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: {
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
  projects: [
    {
      name: 'smoke',
      testIgnore: ['tests/e2e/**', '**/full.e2e.*'],
      timeout: 45_000,
      use: { ...devices['Desktop Chrome'] },
      expect: { timeout: 7_000 },
    },
    {
      name: 'full-e2e',
      testMatch: ['tests/e2e/**', '**/full.e2e.*'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
