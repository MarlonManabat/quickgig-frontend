import { test, expect } from "@playwright/test";
import { expectedHref, silenceNonErrors } from "../helpers/env";

test.describe("Landing header/hero CTAs", () => {
  test.beforeEach(async ({ page }) => {
    silenceNonErrors(page);
    await page.goto("/");
  });

  test("Find Work & Post Job link to app origin", async ({ page }) => {
    const find = page.locator('[data-testid="find-work-link"]');
    const post = page.locator('[data-testid="post-job-link"]');

    await expect(find).toHaveAttribute("href", expectedHref("/find"));
    await expect(post).toHaveAttribute("href", expectedHref("/posts"));
  });
});
