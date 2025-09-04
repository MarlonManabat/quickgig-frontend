import { test, expect } from '@playwright/test';
import { expectAuthAwareSuccess } from '../e2e/helpers';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('hero-post-job')).toBeVisible();

  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('hero-browse-jobs').click(),
  ]);
  await expect(page).toHaveURL(/\/browse-jobs/);

  await page.goto('/');
  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('hero-post-job').click(),
  ]);
  await expectAuthAwareSuccess(page, /\/gigs\/create/);
});
