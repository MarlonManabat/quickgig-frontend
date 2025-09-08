import { test, expect } from "@playwright/test";

test("Browse list renders", async ({ page }) => {
  await page.goto("/browse-jobs");
  // Prefer list if present, otherwise allow empty state in preview
  const list = page.getByTestId("jobs-list");
  if (await list.count()) {
    await expect(list).toBeVisible();
  } else {
    const hasEmpty = await page
      .getByText(/no jobs yet|wala pang jobs|empty state/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(hasEmpty).toBeTruthy();
  }
});
