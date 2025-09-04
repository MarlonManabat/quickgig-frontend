import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, expectToBeOnRoute } from '../e2e/helpers';

test.use({ viewport: { width: 1200, height: 900 } });

test('Desktop header exposes CTAs and routes correctly', async ({ page }) => {
  await page.goto('/');
  await expectToBeOnRoute(page, '/browse-jobs');
  await expect(page.getByTestId('nav-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('nav-post-job')).toBeVisible();
  await expect(page.getByTestId('nav-my-applications')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toBeVisible();

  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('nav-browse-jobs').click(),
  ]);
  await expectToBeOnRoute(page, '/browse-jobs');

  await page.goto('/');
  await expectToBeOnRoute(page, '/browse-jobs');
  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('nav-post-job').click(),
  ]);
  await expectAuthAwareRedirect(page, '/gigs/create');
});
