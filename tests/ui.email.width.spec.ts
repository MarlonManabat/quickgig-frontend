import { test, expect } from '@playwright/test';

test.describe('email field width', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  const pages = [
    { path: '/login', testId: 'auth-email' },
    { path: '/signup', testId: 'email-input' },
    { path: '/auth', testId: 'email-input' },
  ];

  for (const p of pages) {
    test(`email input is wide on ${p.path}`, async ({ page }) => {
      await page.goto(p.path);
      const el = page.getByTestId(p.testId);
      await expect(el).toBeVisible();
      const box = await el.boundingBox();
      expect(box?.width || 0).toBeGreaterThanOrEqual(600);
    });
  }
});
