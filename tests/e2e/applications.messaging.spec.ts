import { test, expect } from '@playwright/test';
import { signUpOrLogin } from '../utils/auth';
import { failOnConsoleErrors } from '../utils/consoleFail';

test('apply → thread → message → bell deep link', async ({ page }, testInfo) => {
  failOnConsoleErrors(page, testInfo);
  const email = `applicant+${Date.now()}@example.com`;
  await signUpOrLogin(page, email, 'Password123!');
  await page.goto('/gigs');
  const anyGig = page.getByTestId('gig-open').first();
  await anyGig.click();
  if (await page.getByTestId('apply-btn').isVisible()) {
    await page.getByTestId('apply-btn').click();
  }
  await expect(page).toHaveURL(/\/applications\/\d+|\/applications\/[0-9a-f-]{6,}$/);
  await page.getByTestId('composer-input').fill('Hello!');
  await page.getByTestId('composer-send').click();
  await expect(page.getByText('Hello!')).toBeVisible();
  await page.getByTestId('nav-bell').click();
  const firstNotif = page.getByTestId('notif-item').first();
  await firstNotif.click();
  await expect(page).toHaveURL(/\/applications\/\d+|\/applications\/[0-9a-f-]{6,}$/);
});
