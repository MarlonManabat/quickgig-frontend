import { defineConfig } from '@playwright/test';

const MODE = process.env.E2E_MODE ?? 'PR'; // 'PR' | 'FULL'
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['line'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  outputDir: 'test-results/artifacts',
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: BASE_URL,
    headless: true,
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npx next start -p 3000',
        url: 'http://localhost:3000',
        timeout: 120_000,
        reuseExistingServer: true,
        env: {
          NEXT_PUBLIC_SUPABASE_URL:
            process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key',
        },
      },
  // Filter what runs on PR: only smoke tests, skip @wip
  grep: MODE === 'PR' ? /@smoke/ : undefined,
  grepInvert: MODE === 'PR' ? /@wip/ : undefined,
  testMatch: MODE === 'PR' ? ['tests/smoke/**/*.spec.*'] : ['tests/**/*.spec.*'],
});
