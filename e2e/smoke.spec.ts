import { test, expect } from '@playwright/test';

test('home page renders', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('banner')).toBeVisible();
});
