import { test, expect } from "@playwright/test";
import { silenceNonErrors } from "../helpers/env";

test.describe("/create guard (logged out)", () => {
  test.beforeEach(async ({ page }) => {
    silenceNonErrors(page);
  });

  test("shows inline 'please log in' and does not crash", async ({ page }) => {
    await page.goto("/create");
    await expect(page.getByText("please log in")).toBeVisible();
    // No navigation loop; stays on /create
    await expect(page).toHaveURL(/\/create$/);
  });
});
