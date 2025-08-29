import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';

test.setTimeout(120_000);

test('NCR cascade shows 17 LGUs', async ({ page }) => {
  await page.goto(`${APP}/post`, { waitUntil: 'domcontentloaded' });

  const region = page.getByTestId('region-select');
  await region.selectOption({ label: /(NCR|National Capital Region)/i });

  const province = page.getByTestId('province-select');
  await expect(province).toBeEnabled();
  await province.selectOption({ label: /(Metro Manila|NCR)/i });

  const cityOptions = page.locator('[data-testid="city-select"] option');
  await expect(cityOptions).toHaveCount(18);
  await expect(page.getByTestId('city-select')).toContainText(/Pateros/i);
});
