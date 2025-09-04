import { test, expect } from "@playwright/test";
import { expectAuthAwareRedirect } from "../e2e/helpers";

test.describe('Landing → App CTAs', () => {
  test('“Post a job” opens on app host', async ({ page }) => {
    await page.goto("/smoke/landing-ctas");
    await expect(
      page.getByRole("heading", { name: "Smoke: Landing CTAs" })
    ).toBeVisible();
    const link = page
      .getByTestId("cta-post-job")
      .or(page.getByRole("link", { name: /post a job/i }));
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForLoadState("domcontentloaded"),
      link.click(),
    ]);
    await expectAuthAwareRedirect(page, "**/gigs/create**");
  });

  test('“My Applications” opens on app host', async ({ page }) => {
    await page.goto("/smoke/landing-ctas");
    await expect(
      page.getByRole("heading", { name: "Smoke: Landing CTAs" })
    ).toBeVisible();
    const link = page
      .getByTestId("cta-my-applications")
      .or(page.getByRole("link", { name: /my applications/i }));
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForLoadState("domcontentloaded"),
      link.click(),
    ]);
    await expectAuthAwareRedirect(page, "**/applications**");
  });
});
