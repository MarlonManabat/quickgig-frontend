import { test } from '@playwright/test';
import { gotoHome, openMenu, expectToBeOnRoute, expectAuthAwareRedirect } from './_helpers';

test.use({ viewport: { width: 360, height: 740 } });

test.describe('mobile header CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await gotoHome(page);
    await openMenu(page);
    await page.getByTestId('navm-browse-jobs').click();
    await expectToBeOnRoute(page, /\/browse-jobs\/?/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await openMenu(page);
    await page.getByTestId('navm-post-job').click();
    await expectAuthAwareRedirect(page, '/gigs/create');
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await openMenu(page);
    await page.getByTestId('navm-my-applications').click();
    await expectAuthAwareRedirect(page, '/applications');
  });

  test('Login', async ({ page }) => {
    await gotoHome(page);
    await openMenu(page);
    await page.getByTestId('navm-login').click();
    await expectToBeOnRoute(page, /\/login\/?/);
  });
});
