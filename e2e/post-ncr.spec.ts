import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';
test('/post: NCR → Metro Manila → 17 LGUs', async ({ page }) => {
  await page.goto(`${APP}/post`, { waitUntil:'domcontentloaded' });
  await page.getByLabel(/Region/i).selectOption(/NCR|National Capital Region/i);
  await page.getByLabel(/Province|Metro|HUC/i).selectOption(/Metro Manila|NCR/i);
  const opts = page.locator('select[name="city"] option');
  await expect(opts).toHaveCount(18); // 1 placeholder + 17 LGUs
  await expect(page.locator('select[name="city"]')).toContainText(/Pateros/i);
});
