import { test, expect } from '@playwright/test';

test.skip('login form sends magic link', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.click('button[type=submit]');
  await expect(page.locator('text=Magic link sent')).toBeVisible();
});
