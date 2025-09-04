import { test } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect, expectToBeOnRoute } from '../e2e/_helpers';

test.describe('desktop header CTAs', () => {
  test('Login', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-login').first().click();
    await expectToBeOnRoute(page, /\/login\/?$/);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-my-applications').first().click();
    await expectAuthAwareRedirect(page, '/applications');
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-post-job').first().click();
    await expectAuthAwareRedirect(page, '/gigs/create');
  });
});
