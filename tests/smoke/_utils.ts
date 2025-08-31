import { Page, expect } from '@playwright/test';

export async function goHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  // Robust: allow multiple <main> nodes (layouts, portals, error boundaries)
  const main = page.getByRole('main').first().or(page.locator('main').first());
  // If your TS complains about `.or(...)`, just use the next line instead:
  // const main = page.getByRole('main').first();

  await expect(main).toBeVisible({ timeout: 15_000 }); // hydration visible
  await page.waitForLoadState('networkidle');          // settle network
}
