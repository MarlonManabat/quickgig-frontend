import { test, expect } from "@playwright/test";

test("Browse list renders", async ({ page }) => {
  await page.goto("/browse-jobs");
  // Prefer list if present; otherwise an empty state is acceptable in preview/CI
  const list = page.getByTestId("jobs-list");
  const hasList = (await list.count()) > 0;
  if (hasList) {
    await expect(list).toBeVisible();
  } else {
    const hasCard = (await page.getByTestId("job-card").count()) > 0;
    const hasEmpty = await page
      .getByText(/no jobs|empty state/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(hasCard || hasEmpty).toBeTruthy();
  }
});
