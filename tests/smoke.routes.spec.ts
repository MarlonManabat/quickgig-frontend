import { test, expect } from '@playwright/test';
import { BASE } from './smoke.env';

test('Landing loads and CTAs target canonical routes', async ({ page }) => {
  const res = await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  expect(res?.ok(), 'landing should load').toBeTruthy();

  const post = page.locator('a[href="/post-jobs"]');
  const browse = page.locator('a[href="/browse-jobs"]');

  await expect(post, 'Post Job CTA should exist').toHaveCount(1);
  await expect(browse, 'Browse Jobs CTA should exist').toHaveCount(1);
});
