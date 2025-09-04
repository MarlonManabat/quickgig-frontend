import { test, expect } from '@playwright/test';

test('root "/" redirects to /browse-jobs', async ({ page }) => {
  const resp = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(resp?.status()).not.toBe(404);
  await expect(page).toHaveURL(/\/browse-jobs\/?$/);
});
