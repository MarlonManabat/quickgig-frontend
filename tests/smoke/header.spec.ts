import { test, expect } from '@playwright/test';
import { hardenSmoke } from './_utils';

test('Landing header/hero CTAs', async ({ page }) => {
  await hardenSmoke(page);

  await page.goto('/');
  // Let the shell render + hydrate
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  // Prefer ARIA role if available, then data-testid, then <header>
  const header = page
    .locator('[role=banner], [data-testid="app-header"], header')
    .first();

  // Give a quick retry loop to tolerate streaming/hydration
  await expect(header).toBeVisible({ timeout: 5000 });

  const findWork = page
    .getByRole('link', { name: /find work|browse jobs/i })
    .first();
  await expect(findWork).toBeVisible();
});
