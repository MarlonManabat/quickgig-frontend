import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
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
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key',
    },
  },
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
      testMatch: ['tests/**/*.spec.ts'],
    },
  ],
});
