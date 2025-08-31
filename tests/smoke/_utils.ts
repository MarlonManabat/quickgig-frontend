import { Page, expect } from '@playwright/test';

export async function goHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const main = page.getByRole('main').first();
  await expect(main).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState('networkidle');
}
