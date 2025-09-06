import { test, expect } from '@playwright/test';

test('Browse list is non-empty (dev/CI)', async ({ page }) => {
  await page.goto('/browse-jobs');
  await expect(page.getByTestId('jobs-list')).toBeVisible();
  const cards = page.getByTestId('job-card');
  await expect(await cards.count()).toBeGreaterThan(0);
});
