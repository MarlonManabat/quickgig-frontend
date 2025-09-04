import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from '../e2e/helpers';

async function openMenu(page) {
  await page.getByTestId('navm-toggle').click();
}

test.use({ viewport: { width: 360, height: 740 } });

test.describe('mobile header CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    await page.getByTestId('navm-browse-jobs').click();
    await expect(page).toHaveURL(/\/browse-jobs/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    await page.getByTestId('navm-post-job').click();
    await expectAuthAwareRedirect(page, /\/gigs\/create$/);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    await page.getByTestId('navm-my-applications').click();
    await expectAuthAwareRedirect(page, /\/applications$/);
  });

  test('Login', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    await page.getByTestId('navm-login').click();
    await expect(page).toHaveURL(/\/login/);
  });
});
