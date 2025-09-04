import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, expectToBeOnRoute } from '../e2e/helpers';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await page.goto('/landing');
  await expect(page.getByTestId('hero-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('hero-post-job')).toBeVisible();

  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('hero-browse-jobs').click(),
  ]);
  await expectToBeOnRoute(page, '/browse-jobs');

  await page.goto('/landing');
  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('hero-post-job').click(),
  ]);
  await expectAuthAwareRedirect(page, '/gigs/create');
});
