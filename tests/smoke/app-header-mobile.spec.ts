import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } }); // iPhone-ish

test('Mobile header exposes CTAs via menu and routes correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-menu-button')).toBeVisible();
  await page.getByTestId('nav-menu-button').click();
  await expect(page.getByTestId('navm-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('navm-post-job')).toBeVisible();
  await expect(page.getByTestId('navm-my-applications')).toBeVisible();
  await expect(page.getByTestId('navm-login')).toBeVisible();
  await page.getByTestId('navm-browse-jobs').click();
  await expect(page).toHaveURL(/\/browse-jobs/);
});
