import { test, expect } from '@playwright/test';

test('auth page loads (smoke)', async ({ page }) => {
  const res = await page.goto('/auth');
  // Ensure the route exists and returns 2xx/3xx in CI
  expect(res && (res.status() < 400)).toBeTruthy();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
});
