import { test, expect } from '@playwright/test';

test('Root "/" redirects to /browse-jobs', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/browse-jobs\b/);
});
