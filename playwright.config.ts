import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const isCI = !!process.env.CI;
const CI_FAST = !!process.env.CI_FAST;

export default defineConfig({
  testDir: "./tests",
  testIgnore: CI_FAST
    ? ["tests/**/full_e2e.*", "tests/**/tickets.e2e.*"]
    : [],
  timeout: isCI ? 180_000 : 60_000,
  expect: { timeout: isCI ? 20_000 : 10_000 },
  fullyParallel: true,
  retries: 1,
  use: {
    headless: true,
    trace: isCI ? "retain-on-failure" : "on",
    screenshot: isCI ? "only-on-failure" : "on",
    video: "off",
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
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
