import { test, expect } from '@playwright/test';
import { BASE } from './smoke.env';

test('Gate: /post-job redirects when user not eligible', async ({ page }) => {
  const res = await page.goto(`${BASE}/post-job`, { waitUntil: 'domcontentloaded' });

  // Accept either login redirect or billing gate page (when session exists but balance<1)
  const url = page.url();
  const looksGated = /\/(login|billing\/tickets)/.test(url);
  expect(looksGated, `expected redirect to login or /billing/tickets, got: ${url}`).toBeTruthy();

  // If we landed on billing, the page should mention tickets
  if (/billing\/tickets/.test(url)) {
    await expect(page.getByText(/ticket/i)).toBeVisible();
  }
});
