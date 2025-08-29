import { test, expect } from '@playwright/test';

test('@smoke locations JSON loads & filters', async ({ page }) => {
  await page.goto('/');

  let res = await page.request.get('/data/ph_locations.json');
  if (!res.ok()) {
    res = await page.request.get('/api/locations');
  }
  expect(res.ok()).toBeTruthy();

  const data = await res.json();
  const ncr = data.regions.find((r: any) => r.code === 'NCR');
  expect(ncr).toBeTruthy();

  const ncrCities = data.cities.filter((c: any) => c.region_code === 'NCR');
  expect(ncrCities.length).toBeGreaterThan(10);
});
