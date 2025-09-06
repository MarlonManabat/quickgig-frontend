import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test.describe('tickets top-up pending order', () => {
  test('tickets top-up pending order', async ({ page }) => {
    await gotoHome(page);
    await page.goto('/tickets');
    await page.locator('[data-cta="buy-tickets"]').click();
    // In CI (logged out), this flow is auth-aware; accept redirect to login.
    try {
      await expectAuthAwareRedirect(page, '/tickets');
      return;
    } catch {
      // If not redirected (local dev), assert pending status on mock page
      await expect(page.locator('#order-status')).toContainText('pending', { ignoreCase: true });
    }
  });
});
