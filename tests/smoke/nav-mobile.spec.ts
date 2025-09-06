import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect, openMobileMenu } from './_helpers';

test.use({ viewport: { width: 360, height: 740 } });

test.describe('mobile header CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await gotoHome(page);
    await openMobileMenu(page);
    await page.getByTestId('navm-browse-jobs').first().click();
    await expect(page).toHaveURL(/\/browse-jobs\/?/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await openMobileMenu(page);
    await page.getByTestId('navm-post-job').first().click();
    await expectAuthAwareRedirect(page, '/post-job');
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await openMobileMenu(page);
    await page.getByTestId('navm-my-applications').first().click();
    await expectAuthAwareRedirect(page, '/applications');
  });

  test('Login', async ({ page }) => {
    await gotoHome(page);
    await openMobileMenu(page);
    await page.getByTestId('navm-login').first().click();
    await expect(page).toHaveURL(/\/login\/?/);
  });
});
