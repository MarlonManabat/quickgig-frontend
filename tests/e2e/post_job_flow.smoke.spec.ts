// @ts-nocheck
import { test, expect } from '@playwright/test';

test('post job form validates', async ({ page }) => {
  await page.goto('https://app.quickgig.ph');
  const link = page.getByRole('link', { name: /Post Job/i }).first();
  if (await link.isVisible()) {
    await link.click();
  } else {
    await page.goto('https://app.quickgig.ph/post');
  }
  await page.waitForLoadState('domcontentloaded');
  const required = page.locator('form input[required], form textarea[required], form select[required]');
  await expect(required.first()).toBeVisible();
  if (process.env.ALLOW_DESTRUCTIVE !== 'true') {
    const submit = page.locator('form button[type="submit"], form input[type="submit"]').first();
    if (await submit.isVisible()) {
      await submit.click();
      const invalid = page.locator(':invalid');
      expect(await invalid.count()).toBeGreaterThan(0);
    }
  }
  const errors: string[] = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  expect(errors).toEqual([]);
});
