import { test, expect } from '@playwright/test';

test('My Applications link redirects when signed out', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const link = page.getByRole('link', { name: /my applications/i });
  await link.click();
  await expect(page).toHaveURL(/\/(login|applications\/login)/);
});
