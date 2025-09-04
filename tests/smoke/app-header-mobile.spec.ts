import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, expectToBeOnRoute } from '../e2e/helpers';

test.use({ viewport: { width: 390, height: 844 } });

test('Mobile header exposes CTAs via menu and routes correctly', async ({ page }) => {
  await page.goto('/');
  await expectToBeOnRoute(page, '/browse-jobs');
  await expect(page.getByTestId('nav-menu-button')).toBeVisible();
  await page.getByTestId('nav-menu-button').click();

  await expect(page.getByTestId('navm-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('navm-post-job')).toBeVisible();
  await expect(page.getByTestId('navm-my-applications')).toBeVisible();
  await expect(page.getByTestId('navm-login')).toBeVisible();

  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('navm-browse-jobs').click(),
  ]);
  await expectToBeOnRoute(page, '/browse-jobs');

  await page.goto('/');
  await expectToBeOnRoute(page, '/browse-jobs');
  await page.getByTestId('nav-menu-button').click();
  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('navm-post-job').click(),
  ]);
  await expectAuthAwareRedirect(page, '/gigs/create');
});
