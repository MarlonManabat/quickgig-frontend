import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';

test.setTimeout(90_000);
test('App home “Maghanap ng Trabaho” opens /search', async ({ page }) => {
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  const findBtn = page.getByRole('link', { name: /maghanap ng trabaho|find work|browse jobs/i }).first();
  await expect(findBtn).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    findBtn.click(),
  ]);
  expect(new URL(page.url()).pathname).toMatch(/^\/search\/?$/);
});
