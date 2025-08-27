import { test, expect } from '@playwright/test';

test('home renders & header visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('link', { name: /quickgig/i })).toBeVisible();
});
