import { test, expect } from '@playwright/test';

// basic smoke for manual top-up flow
// does not upload receipt to keep fast

test('tickets top-up pending order', async ({ page }) => {
  await page.goto('/tickets/topup');
  await expect(page.getByTestId('buy-tickets')).toBeVisible();
  await page.getByTestId('buy-tickets').click();
  await expect(page.locator('#order-status')).toContainText('pending', { ignoreCase: true });
});
