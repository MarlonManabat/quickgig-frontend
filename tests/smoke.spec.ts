import { test, expect } from '@playwright/test';
import { failOnConsoleErrors } from './utils/consoleFail';

test.describe('@smoke navigation & flows', () => {
  test.beforeEach(async ({ page }, testInfo) => { failOnConsoleErrors(page, testInfo); });

  test('home -> auth -> profile', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-login').click();
    await expect(page).toHaveURL(/login|signin|auth/i);
    if (await page.getByTestId('nav-profile').isVisible().catch(() => false)) {
      await page.getByTestId('nav-profile').click();
      await expect(page).toHaveURL(/profile/i);
    }
  });

  test('gigs list -> detail', async ({ page }) => {
    await page.goto('/gigs');
    const first = page.getByTestId('gig-card').first();
    await first.click();
    await expect(page).toHaveURL(/gigs\/\w+/);
    await expect(page.getByTestId('gig-title')).toBeVisible();
  });

  test('applications list -> detail (id guard)', async ({ page }) => {
    await page.goto('/applications');
    const row = page.getByTestId('application-row').first();
    if (await row.count() === 0) test.skip();
    await row.click();
    await expect(page).toHaveURL(/applications\/\w+/);
    await expect(page.getByTestId('application-title')).toBeVisible();
  });

  test('messages thread open', async ({ page }) => {
    await page.goto('/messages');
    const thread = page.getByTestId('thread-row').first();
    if (await thread.count() === 0) test.skip();
    await thread.click();
    await expect(page).toHaveURL(/messages\/\w+/);
    await expect(page.getByTestId('chat-input')).toBeVisible();
  });

  test('notifications list opens', async ({ page }) => {
    await page.goto('/notifications');
    await expect(page.getByTestId('notifications-list')).toBeVisible();
  });
});
