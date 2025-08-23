import { test, expect } from '@playwright/test';
import { stubAuth } from './utils/stubAuth';
import { failOnConsoleErrors } from './utils/consoleFail';

test.describe('@smoke auth guards', () => {
  test.beforeEach(async ({ page }, testInfo) => { failOnConsoleErrors(page, testInfo); });

  test('redirects to auth when signed out', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForURL(/\/auth/);
  });

  test('profile loads with stubbed auth', async ({ page }) => {
    await stubAuth(page);
    await page.goto('/profile');
    await expect(page.getByTestId('profile-save')).toBeVisible();
  });
});
