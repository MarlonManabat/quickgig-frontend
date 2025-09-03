import { test, expect } from '@playwright/test';

test.describe('mobile nav', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('menu opens and Browse jobs link works', async ({ page }) => {
    await page.goto('/');
    // If landing redirects to app, continue; otherwise click the CTA that leads to app.
    // Open mobile menu if toggle is visible:
    const menuBtn = page.getByRole('button', { name: /menu/i });
    if (await menuBtn.isVisible()) await menuBtn.click();

    await page.getByRole('link', { name: /browse jobs/i }).first().click();
    await expect(page).toHaveURL(/\/browse-jobs/);
    await expect(page.getByRole('heading', { name: /browse jobs/i })).toBeVisible();
  });
});
