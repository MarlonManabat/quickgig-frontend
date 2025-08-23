import { test, expect } from '@playwright/test';

test('header is dark with white text, surface is white', async ({ page }) => {
  await page.goto('/find');
  const header = page.locator('header');
  const main = page.locator('main');
  await expect(header).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(main).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('link', { name: /QuickGig\.ph/i })).toBeVisible();
});
