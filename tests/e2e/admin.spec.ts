import { test } from "@playwright/test";
import { PAGES } from "../pages";
import { auditPage } from "../utils/buttonAudit";
import { loginAs } from "./_helpers/session";

const baseSet = PAGES.admin;

test.describe("admin pages", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
  });
  for (const path of baseSet) {
    test(`audit ${path}`, async ({ page }) => {
      if (!process.env.BASE_URL) test.skip(true, "BASE_URL not set");
      await page.goto(path);
      await auditPage(page, path);
    });
  }
});
