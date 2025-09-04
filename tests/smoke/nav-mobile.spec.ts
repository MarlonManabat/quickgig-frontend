import { test, expect } from '@playwright/test';
test.use({ viewport: { width: 360, height: 740 } });

test.describe('mobile header CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-menu-button').click();
    await expect(page.getByTestId('navm-browse-jobs')).toBeVisible();
    await page.getByTestId('navm-browse-jobs').click();
    await expect(page).toHaveURL(/\/browse-jobs\/?/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-menu-button').click();
    await page.getByTestId('navm-post-job').click();
    await expect(page).toHaveURL(/\/login\?next=\/gigs\/create\/?/);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-menu-button').click();
    await page.getByTestId('navm-my-applications').click();
    await expect(page).toHaveURL(/\/login\?next=\/applications\/?/);
  });

  test('Login', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-menu-button').click();
    await page.getByTestId('navm-login').click();
    await expect(page).toHaveURL(/\/login\/?/);
  });
});
