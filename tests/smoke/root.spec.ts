import { test, expect } from '@playwright/test';

test('root "/" redirects to /browse-jobs', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/browse-jobs/);
  await expect(page.getByRole('heading', { name: /browse jobs/i })).toBeVisible();
});
