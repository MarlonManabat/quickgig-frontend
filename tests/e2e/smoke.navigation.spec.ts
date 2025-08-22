import { test, expect } from '@playwright/test';
import '../utils/consoleFail';

test('primary nav works without console errors', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-find')).toBeVisible();
  const taps = ['nav-find','nav-my-gigs','nav-apps','nav-saved','nav-auth'];
  for (const id of taps) {
    await page.getByTestId(id).click();
    await expect(page).toHaveURL(/\/(gigs|applications|saved|auth)/);
  }
});
