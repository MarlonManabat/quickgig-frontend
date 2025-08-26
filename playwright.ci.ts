import { defineConfig } from "@playwright/test";
import baseConfig from "./playwright.config";

export default defineConfig({
  ...(baseConfig as any),
  projects: [
    { name: "public" },
    { name: "worker", use: { storageState: "playwright/.auth/worker.json" } },
    {
      name: "employer",
      use: { storageState: "playwright/.auth/employer.json" },
    },
    { name: "admin", use: { storageState: "playwright/.auth/admin.json" } },
  ],
  reporter: [
    ["github"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  timeout: 60_000,
  use: {
    ...((baseConfig as any).use ?? {}),
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL || (baseConfig as any).use?.baseURL,
    video: "off",
    trace: "retain-on-failure",
  },
});
