import { test, expect } from '@playwright/test';
import { BASE } from './smoke.env';

test('Find Work page renders and GeoSelect is present (best effort)', async ({ page }) => {
  const res = await page.goto(`${BASE}/gigs`, { waitUntil: 'domcontentloaded' });
  expect(res?.ok(), '/gigs should load').toBeTruthy();

  // Look for any of the select placeholders we ship
  const region = page.getByRole('combobox').first();
  await expect(region, 'at least one select should render').toBeVisible();
});
