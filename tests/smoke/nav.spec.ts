import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test.describe('desktop header CTAs', () => {
  test('Login', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-login').click();
    await expect(page).toHaveURL(/\/login\/?$/);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-my-applications').click();
    await expectAuthAwareRedirect(page, '/applications');
  });
});
