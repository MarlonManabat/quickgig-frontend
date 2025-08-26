import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  timeout: isCI ? 180_000 : 60_000,
  expect: { timeout: isCI ? 20_000 : 10_000 },
  fullyParallel: true,
  use: {
    headless: true,
    trace: isCI ? "retain-on-failure" : "on",
    screenshot: isCI ? "only-on-failure" : "on",
    video: "off",
    baseURL,
    actionTimeout: isCI ? 15_000 : 10_000,
    navigationTimeout: isCI ? 30_000 : 15_000,
  },
  reporter: [
    ["github"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  projects: [
    {
      name: "smoke",
      testIgnore: [
        "tests/**/full.e2e*.spec.ts",
        "tests/e2e/**",
      ],
      retries: 1,
    },
    {
      name: "full-e2e",
      testMatch: [
        "tests/**/full.e2e*.spec.ts",
        "tests/e2e/**",
      ],
      retries: 0,
    },
  ],
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
