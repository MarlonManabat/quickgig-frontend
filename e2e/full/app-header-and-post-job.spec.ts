import { test, expect } from '@playwright/test';
import { APP_ORIGIN, QA } from '../helpers/env';

test.describe('App header + Post Job', () => {
  test('Header links route inside app', async ({ page }) => {
    await page.goto(`${APP_ORIGIN}/find`);
    await expect(page.getByRole('link', { name: /find work/i })).toHaveAttribute('href', '/find');
    await expect(page.getByRole('link', { name: /post job/i })).toHaveAttribute('href', '/post');
    await expect(page.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  });

  test('Post job shows guard when logged out', async ({ page }) => {
    await page.goto(`${APP_ORIGIN}/post`);
    await page.getByLabel(/title/i).fill('Guard check');
    await page.getByLabel(/description/i).fill('Should require login');
    await page.getByLabel(/price/i).fill('100');
    await page.getByRole('button', { name: /create/i }).click();
    await expect(page.getByText(/please log in|login required/i)).toBeVisible();
  });

  test('Post job happy path (QA account)', async ({ page }) => {
    test.skip(!QA.mode, 'QA_TEST_MODE is not true');

    // Log in
    await page.goto(`${APP_ORIGIN}/login`);
    await page.getByLabel(/email/i).fill(QA.email);
    await page.getByLabel(/password|secret/i).fill(QA.secret);
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(new RegExp(`${APP_ORIGIN}/`));

    // Post job
    await page.goto(`${APP_ORIGIN}/post`);
    const unique = `E2E ${Date.now()}`;
    await page.getByLabel(/title/i).fill(unique);
    await page.getByLabel(/description/i).fill('E2E create gig');
    await page.getByLabel(/price/i).fill('500');

    // Region + city (adjust labels to match your selects)
    await page.getByRole('combobox').nth(0).selectOption({ label: /bicol region/i });
    await page.getByRole('combobox').nth(1).selectOption({ label: /legazpi/i });

    await page.getByRole('button', { name: /create/i }).click();

    // Success UI (toast or confirmation)
    await expect(
      page.getByText(/created|success|posted/i, { exact: false })
    ).toBeVisible({ timeout: 10000 });
  });
});
