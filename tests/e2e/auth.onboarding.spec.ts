import { test, expect } from '@playwright/test';
import { signUpOrLogin } from '../utils/auth';
import '../utils/consoleFail';

test('signup → profile → gigs', async ({ page }) => {
  const email = `user+${Date.now()}@example.com`;
  await signUpOrLogin(page, email, 'Password123!');
  if (page.url().includes('/profile')) {
    await page.getByTestId('profile-name').fill('User A');
    await page.getByTestId('profile-save').click();
    await expect(page).toHaveURL(/\/gigs/);
  }
});
