import { test, expect } from '@playwright/test';
import { getDemoEmail, stubSignIn } from './utils/session';

const APP_URL =
  process.env.APP_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'https://app.quickgig.ph';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  await page.goto(process.env.NEXT_PUBLIC_LANDING_URL!);
  await page.locator('#cta-start').click();
  await page.waitForURL('**/start', { timeout: 10_000 });
  await expect(page.getByRole('navigation')).toBeVisible();
});

test(
  'app notifications bell visible after login (skips if no demo creds)',
  async ({ page }) => {
    const email = getDemoEmail('user');
    test.skip(
      !email,
      'No demo user email available via env or optional fixture',
    );

    await stubSignIn(page, email!);
    await page.goto(APP_URL + '/');

    // Use your actual selector for the notifications bell:
    const bell = page.getByRole('button', { name: /notifications/i }).first();
    await expect(bell).toBeVisible();
  },
);

test('wallet submit visible after login (skips if no demo creds)', async ({ page }) => {
  const email = getDemoEmail('user');
  test.skip(!email, 'No demo user email available via env or optional fixture');
  await stubSignIn(page, email!);
  await page.goto(APP_URL + '/wallet');
  await expect(page.getByTestId('submit-receipt')).toBeVisible();
});
