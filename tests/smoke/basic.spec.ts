import { test, expect } from '@playwright/test';

const app = process.env.PLAYWRIGHT_APP_URL!;

test('app nav and auth redirect', async ({ page }) => {
  const response = await page.goto(app, { waitUntil: 'load' });
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-app-header]')).toBeVisible();
  await expect(page.getByTestId('app-nav-find-work')).toBeVisible();
  await page.getByTestId('app-login').click();
  await expect(page).toHaveURL(/auth/);
  const res = await page.goto(`${app}/gigs`, { waitUntil: 'load' });
  expect(res?.status()).toBe(200);
});
