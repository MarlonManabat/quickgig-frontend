import { test, expect } from '@playwright/test';
import { BASE } from './smoke.env';

test('Landing loads and CTAs target canonical routes', async ({ page }) => {
  const res = await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  expect(res?.ok(), 'landing should load').toBeTruthy();

  const post = page.locator('a[href="/gigs/create"]');
  const find = page.locator('a[href="/gigs"]');

  await expect(post, 'Post Job CTA should exist').toHaveCount(1);
  await expect(find, 'Find Work CTA should exist').toHaveCount(1);
});
