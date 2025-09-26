import { test, expect } from "@playwright/test";

test("/browse-jobs shows a job card in MOCK_MODE=1", async ({ page }) => {
  await page.goto("/browse-jobs");
  await expect(page.getByTestId("job-card").first()).toBeVisible();
  await expect(page.getByTestId("job-apply").first()).toBeVisible();
});
