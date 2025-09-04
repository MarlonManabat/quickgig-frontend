import { test, expect } from '@playwright/test';
import { expectAuthAwareSuccess } from '../e2e/helpers';

test.use({ viewport: { width: 390, height: 844 } });

test('Mobile header exposes CTAs via menu and routes correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-menu-button')).toBeVisible();
  await page.getByTestId('nav-menu-button').click();

  await expect(page.getByTestId('nav-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('nav-post-job')).toBeVisible();
  await expect(page.getByTestId('nav-my-applications')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toBeVisible();

  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('nav-browse-jobs').click(),
  ]);
  await expect(page).toHaveURL(/\/browse-jobs/);

  await page.goto('/');
  await page.getByTestId('nav-menu-button').click();
  await Promise.all([
    page.waitForNavigation(),
    page.getByTestId('nav-post-job').click(),
  ]);
  await expectAuthAwareSuccess(page, /\/gigs\/create/);
});
