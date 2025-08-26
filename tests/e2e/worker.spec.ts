import { workerTest as test } from "../fixtures/roles";
import { PAGES } from "../pages";
import { auditPage } from "../utils/buttonAudit";

const baseSet = PAGES.worker;

test.describe("worker pages", () => {
  for (const path of baseSet) {
    test(`audit ${path}`, async ({ page }) => {
      if (!process.env.BASE_URL) test.skip(true, "BASE_URL not set");
      await page.goto(path);
      await auditPage(page, path);
    });
  }
});
