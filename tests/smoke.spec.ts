import { test, expect } from '@playwright/test';
import { testLogin, disableAnimations } from './utils/test-login';

test.describe('smoke', () => {
  test('landing → app header visible', async ({ page }) => {
    await disableAnimations(page);
    await page.goto(
      process.env.NEXT_PUBLIC_LANDING_URL || process.env.NEXT_PUBLIC_APP_URL!
    );
    await page.waitForLoadState('networkidle');

    const cta = page
      .getByTestId('cta-start')
      .or(page.getByRole('button', { name: /simulan na|start/i }));
    await expect(cta).toBeVisible();
    await Promise.all([
      page.waitForURL('**/start*', { timeout: 20_000 }),
      cta.click(),
    ]);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('header visible after employer login', async ({ page }) => {
    await disableAnimations(page);
    await testLogin(page, 'employer');
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
