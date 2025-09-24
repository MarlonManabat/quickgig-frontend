import { test, expect } from "@playwright/test";

test("/gigs/create shows skeleton and GeoSelect contains Quezon City", async ({ page }) => {
  await page.goto("/gigs/create");
  await expect(page.getByTestId("post-job-skeleton")).toBeVisible();
  await page.waitForTimeout(300);
  await expect(page.locator("select")).toHaveCount(3);
  await expect(page.locator("option")).toContainText("Quezon City");
});
