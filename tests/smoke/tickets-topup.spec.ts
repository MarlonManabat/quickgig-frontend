import { test, expect } from '@playwright/test';

// basic smoke for manual top-up flow
// does not upload receipt to keep fast

test('tickets top-up pending order', async ({ page }) => {
  await page.goto('/tickets');
  await expect(page.locator('[data-cta="buy-tickets"]')).toBeVisible();

  await page.locator('[data-cta="buy-tickets"]').click();
  await expect(page.locator('#buy-1')).toBeVisible();
  await expect(page.locator('#buy-5')).toBeVisible();
  await expect(page.locator('#buy-10')).toBeVisible();

  await page.locator('#buy-1').click();
  await expect(page.locator('#order-status')).toContainText('pending', { ignoreCase: true });
});
