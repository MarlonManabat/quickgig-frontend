import { test, expect } from '@playwright/test';

test('Applications page renders empty state when no applications', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('DEV_AUTH', 'true'));
  await page.goto('/applications');
  await expect(page.getByTestId('applications-list')).toBeVisible();
  await expect(page.getByTestId('application-row')).toHaveCount(0);
  await expect(page.getByTestId('applications-empty')).toBeVisible();
});
