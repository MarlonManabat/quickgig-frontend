import { test, expect } from '@playwright/test';

const BASE = process.env.PREVIEW_URL || 'http://localhost:3000';

test('landing CTAs open /post', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('nav-post').click();
  await expect(page).toHaveURL(/\/post$/);

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('cta-start-now').click();
  await expect(page).toHaveURL(/\/post$/);
});
