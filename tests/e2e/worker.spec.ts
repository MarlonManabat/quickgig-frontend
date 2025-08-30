import { test, expect } from "@playwright/test";
import { PAGES } from "../pages";
import { auditPage } from "../utils/buttonAudit";
import { loginAs } from "./_helpers/session";

const baseSet = PAGES.worker;

test.describe("worker pages", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "worker");
  });

  test("dashboard shows ticket balance", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("ticket-balance")).toBeVisible();
  });
  for (const path of baseSet) {
    test(`audit ${path}`, async ({ page }) => {
      if (!process.env.BASE_URL) test.skip(true, "BASE_URL not set");
      await page.goto(path);
      await auditPage(page, path);
    });
  }
});
