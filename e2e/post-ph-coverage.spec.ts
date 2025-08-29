import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';
test('IV-A → Cavite has Bacoor/Dasmariñas/Imus', async ({ page }) => {
  await page.goto(`${APP}/post`, { waitUntil:'domcontentloaded' });
  await page.getByLabel(/Region/i).selectOption(/IV-A|CALABARZON/i);
  await page.getByLabel(/Province|Metro|HUC/i).selectOption(/Cavite/i);
  await expect(page.locator('select[name="city"]')).toContainText(/Bacoor|Dasmariñas|Imus/i);
});
test('VII shows HUCs (Cebu City/Mandaue/Lapu-Lapu)', async ({ page }) => {
  await page.goto(`${APP}/post`);
  await page.getByLabel(/Region/i).selectOption(/VII|Central Visayas/i);
  await expect(page.locator('select[name="province"]')).toContainText(/Cebu City|Mandaue|Lapu-Lapu/i);
});
test('BARMM → Lanao del Sur → Marawi present', async ({ page }) => {
  await page.goto(`${APP}/post`);
  await page.getByLabel(/Region/i).selectOption(/BARMM/i);
  await page.getByLabel(/Province|Metro|HUC/i).selectOption(/Lanao del Sur/i);
  await expect(page.locator('select[name="city"]')).toContainText(/Marawi/i);
});
