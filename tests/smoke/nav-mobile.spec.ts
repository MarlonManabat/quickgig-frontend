import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect, expectToBeOnRoute } from '../e2e/_helpers';

test.use({ viewport: { width: 360, height: 740 } });

async function openMenu(page) {
  await page.getByTestId('nav-menu-button').click();
  await expect(page.getByTestId('nav-menu')).toBeVisible();
}

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
