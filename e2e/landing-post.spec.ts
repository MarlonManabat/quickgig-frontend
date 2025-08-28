import { test, expect } from '@playwright/test';
const LANDING = process.env.LANDING_URL || process.env.PREVIEW_URL || 'http://localhost:3000';

test.setTimeout(90_000);
test('Landing “Post Job/Simulan Na!” opens app /post', async ({ page }) => {
  await page.goto(LANDING, { waitUntil: 'domcontentloaded' });
  const postLink = page.getByRole('link', { name: /post job|simulan na/i }).first();
  await expect(postLink).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    postLink.click(),
  ]);
  const url = new URL(page.url());
  expect(url.pathname).toMatch(/^\/post\/?$/);
  // Form button exists
  await expect(page.getByRole('button', { name: /post job/i })).toBeVisible();
});
