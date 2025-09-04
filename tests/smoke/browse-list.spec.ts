import { test, expect } from '@playwright/test';

test('Browse list is non-empty (dev/CI)', async ({ page }) => {
  await page.goto('/browse-jobs');
  await expect(page.getByTestId('jobs-list')).toBeVisible();
  await expect(page.getByTestId('job-card')).toHaveCountGreaterThan(0);
});
