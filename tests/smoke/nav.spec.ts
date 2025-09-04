import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

async function gotoHome(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
}

test.describe('desktop header CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-browse-jobs').click();
    await expect(page).toHaveURL(/\/browse-jobs\/?/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-post-job').click();
    await expectAuthAwareRedirect(page, /\/gigs\/create\/?/);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-my-applications').click();
    await expectAuthAwareRedirect(page, /\/applications\/?/);
  });

  test('Login', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-login').click();
    await expect(page).toHaveURL(/\/login\/?/);
  });
});
