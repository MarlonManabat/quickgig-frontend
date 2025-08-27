import { test, expect } from '@playwright/test';

test('auth route is reachable and renders (smoke)', async ({ page, request, baseURL }) => {
  const origin = baseURL || 'http://localhost:3000';
  const url = `${origin}/auth`;

  // Server check: allow 2xx/3xx
  const apiRes = await request.get(url, { maxRedirects: 0 });
  expect(apiRes.status()).toBeLessThan(400);

  // UI check: page renders something
  await page.goto('/auth');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
});
