import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from '@playwright/test';

(() => {
  const dotenvPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(dotenvPath)) {
    const lines = fs.readFileSync(dotenvPath, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
})();

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
  projects: [
    {
      name: 'smoke',
      testMatch: ['tests/smoke/**/*.spec.ts', '**/*.smoke.ts'],
      timeout: 45_000,
      expect: { timeout: 7_000 },
      use: { baseURL: BASE_URL },
    },
    {
      name: 'e2e',
      testMatch: ['tests/e2e/**/*.spec.ts'],
      use: {
        baseURL: BASE_URL,
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
