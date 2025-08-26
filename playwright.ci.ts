import base from "./playwright.config";
import type {
  PlaywrightTestConfig,
  ReporterDescription,
} from "@playwright/test";

const reporters: ReporterDescription[] = [
  ["github"],
  ...((Array.isArray(base.reporter)
    ? base.reporter
    : base.reporter
      ? [base.reporter]
      : []) as ReporterDescription[]),
];

const config: PlaywrightTestConfig = {
  ...base,
  use: { ...base.use, video: "retain-on-failure" },
  reporter: reporters,
  outputDir: "test-results",
};

export default config;
