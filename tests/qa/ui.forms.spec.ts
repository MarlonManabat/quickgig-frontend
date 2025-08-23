import { test, expect } from '@playwright/test';

const longEmail = 'very.long.address.for.testing.1234567890@example-long-domain.com';

test('email input width desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/auth');
  const el = page.locator('#email');
  const box = await el.boundingBox();
  expect(box?.width || 0).toBeGreaterThanOrEqual(600);
});

test('email input width mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/auth');
  const el = page.locator('#email');
  const box = await el.boundingBox();
  expect(box?.width || 0).toBeGreaterThanOrEqual(300);
});

test('long email not clipped', async ({ page }) => {
  await page.goto('/auth');
  const el = page.locator('#email');
  await el.fill(longEmail);
  await expect(el).toHaveValue(longEmail);
});
