import { defineConfig } from "@playwright/test";

const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_LANDING_URL ||
  "http://localhost:3000";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  timeout: isCI ? 180_000 : 60_000,
  expect: { timeout: isCI ? 20_000 : 10_000 },
  retries: process.env.CI ? 1 : 0,
  use: {
    headless: true,
    trace: "on-first-retry",
    baseURL,
    actionTimeout: isCI ? 15_000 : 10_000,
    navigationTimeout: isCI ? 30_000 : 15_000,
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  projects: [
    { name: "smoke", testMatch: /smoke\.spec\.ts$/ },
    {
      name: "full-e2e",
      testMatch: /(?:\.e2e\.spec\.ts|full\.e2e.*\.spec\.ts)$/,
    },
  ],
});
