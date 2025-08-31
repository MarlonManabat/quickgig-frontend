import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';

test.setTimeout(120_000);

test('/post: NCR → Metro Manila → 17 LGUs', async ({ page }) => {
  await page.goto(`${APP}/post`, { waitUntil: 'domcontentloaded' });

  const region = page.locator('[data-testid="region-select"]');
  await expect(region).toBeVisible();
  await region.selectOption({ label: /(NCR|National Capital Region)/i });

  const province = page.locator('[data-testid="province-select"]');
  const city = page.locator('[data-testid="city-select"]');

  await expect(province).toBeEnabled({ timeout: 30000 });
  await expect(async () => {
    const count = await province.locator('option').count();
    expect(count).toBeGreaterThan(0);
  }).toPass({ timeout: 30000 });

  await province.selectOption({ label: /(Metro Manila|NCR)/i });

  await expect(city).toBeEnabled({ timeout: 30000 });
  await expect(async () => {
    const count = await city.locator('option').count();
    expect(count).toBeGreaterThan(0);
  }).toPass({ timeout: 30000 });
  await expect(city.locator('option')).toHaveCount(18, { timeout: 30000 });
  await expect(city).toContainText(/Pateros/i);
});
