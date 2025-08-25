import { test, expect } from '@playwright/test';
import { getDemoEmail, stubSignIn } from './utils/session';
import { env } from './helpers/env';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  // Prefer landing URL; fall back to site/app or localhost for CI/dev.
  const landingUrl = env(
    'NEXT_PUBLIC_LANDING_URL',
    env('NEXT_PUBLIC_SITE_URL', env('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')),
  );
  await page.goto(landingUrl);
  const cta = page.getByTestId('cta-start').or(
    page.getByRole('button', { name: /start|simulan na/i }),
  );
  await expect(cta).toBeVisible({ timeout: 15_000 });
  await Promise.all([
    page.waitForURL('**/start**', { timeout: 20_000 }),
    cta.click(),
  ]);
  await expect(page.getByTestId('app-header')).toBeVisible({ timeout: 20_000 });
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
    await page.goto('/');

    // Use your actual selector for the notifications bell:
    const bell = page.getByRole('button', { name: /notifications/i }).first();
    await expect(bell).toBeVisible();
  },
);

test('wallet submit visible after login (skips if no demo creds)', async ({ page }) => {
  const email = getDemoEmail('user');
  test.skip(!email, 'No demo user email available via env or optional fixture');
  await stubSignIn(page, email!);
  await page.goto('/wallet');
  await expect(page.getByTestId('submit-receipt')).toBeVisible();
});
