import { test, expect } from '@playwright/test';

test('auth page loads a sign-in control', async ({ page }) => {
  await page.goto('/auth');
  await expect(page.locator('input[type="email"], [data-testid="magic-link"], button')).toBeVisible();
});
