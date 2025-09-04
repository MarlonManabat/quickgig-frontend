import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } }); // iPhone-ish

test('Mobile header exposes CTAs via menu and routes correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-menu-button')).toBeVisible();
  await page.getByTestId('nav-menu-button').click();
  await expect(page.getByTestId('navm-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('navm-post-job')).toBeVisible();
  await expect(
    page.getByTestId('navm-login').or(page.getByTestId('navm-my-applications'))
  ).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/browse-jobs/),
    page.getByTestId('navm-browse-jobs').click(),
  ]);
});
