import { expect, test } from '@playwright/test';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('hero-post-job')).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/browse-jobs/),
    page.getByTestId('hero-browse-jobs').click(),
  ]);
});
