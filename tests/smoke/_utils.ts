import { Page, expect } from '@playwright/test';

export async function goHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('main')).toBeVisible();   // hydration visible
  await page.waitForLoadState('networkidle');         // settle network
}
