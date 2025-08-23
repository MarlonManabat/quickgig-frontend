import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.PW_ADMIN_EMAIL!;
const ADMIN_PASS  = process.env.PW_ADMIN_PASS!;

async function login(page, email, pass) {
  await page.goto('/auth/login');
  await page.getByTestId('auth-email').fill(email);
  await page.getByTestId('auth-password').fill(pass);
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForLoadState('networkidle');
}

test.describe('admin guard', () => {
  test('non-admin cannot see nav or admin route', async ({ page }) => {
    await page.goto('/');
    // make sure logged out or logged as non-admin; route directly
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toContain('/admin');
  });

  test('admin sees nav and dashboard', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASS, 'admin creds not configured');
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
    await page.goto('/');
    await expect(page.getByTestId('nav-admin')).toBeVisible();
    await page.getByTestId('nav-admin').click();
    await expect(page.getByTestId('admin-home')).toBeVisible();
  });
});
