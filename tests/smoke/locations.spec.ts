import { test, expect } from '@playwright/test';

test('@smoke locations API has 17 regions', async ({ page }) => {
  await page.goto('/');
  let res = await page.request.get('/data/ph_locations.json');
  if (!res.ok()) res = await page.request.get('/api/locations');
  expect(res.ok()).toBeTruthy();

  const data = await res.json();
  const codes = new Set((data.regions || []).map((r: any) => r.code));
  expect(codes.size).toBeGreaterThanOrEqual(17); // merged with FULL_REGIONS
});
