import { test, expect } from "@playwright/test";
import { expectAuthAwareRedirect } from "../e2e/helpers";

test("nav My Applications link auth-aware", async ({ page }) => {
  await page.goto("/browse-jobs");
  const link = page
    .getByTestId("nav-my-applications")
    .or(page.getByRole("link", { name: /my applications/i }));
  await expect(link).toBeVisible();
  await Promise.all([
    page.waitForLoadState("domcontentloaded"),
    link.click(),
  ]);
  await expectAuthAwareRedirect(page, "**/applications**");
});
