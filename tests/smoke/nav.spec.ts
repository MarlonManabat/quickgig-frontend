import { test, expect } from '@playwright/test';

test('basic nav works', async ({ page }) => {
  await page.goto('/');
  const home = page.getByRole('link', { name: /quickgig/i }).first();
  await home.click();
  await expect(page).toHaveURL(/\/$/);
});
