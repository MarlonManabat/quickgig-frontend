import { test, expect } from '@playwright/test';
import { signUpOrLogin } from '../utils/auth';
import '../utils/consoleFail';

test('create & view a gig (if posting is allowed)', async ({ page }) => {
  const email = `owner+${Date.now()}@example.com`;
  await signUpOrLogin(page, email, 'Password123!');
  await page.getByTestId('nav-post').click();
  if (page.url().includes('/billing')) test.skip(true, 'Posting gated by billing');
  await page.getByLabel(/title/i).fill('Test Gig');
  await page.getByLabel(/description/i).fill('Something to do');
  await page.getByLabel(/budget/i).fill('5000');
  await page.getByRole('button', { name: /create/i }).click();
  await expect(page).toHaveURL(/\/gigs\/\d+/);
  await expect(page.getByText('Test Gig')).toBeVisible();
});
