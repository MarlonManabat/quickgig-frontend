import { test, expect } from '@playwright/test';

test('post job form renders or redirects', async ({ page }) => {
  await page.goto('/gigs/create');
  if (page.url().includes('/login')) {
    await expect(page.getByRole('heading', { name: /sign in|log in/i })).toBeVisible();
    return;
  }
  await Promise.race([
    page.getByRole('heading', { name: 'Post a Job' }).waitFor({ timeout: 10_000 }),
    page.getByTestId('post-job-skeleton').waitFor({ timeout: 10_000 }),
  ]);
});
