import { test, expect } from '@playwright/test';

// basic smoke for manual top-up flow
// does not upload receipt to keep fast

test('tickets top-up pending order', async ({ page }) => {
  await page.goto('/tickets');
  const buy = page.getByTestId('buy-tickets');
  await expect(buy).toBeVisible();
  await buy.click();
  await expect(page.locator('#order-status')).toContainText('pending', { ignoreCase: true });
});
