import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';

test('post page renders without widget errors', async ({ page }) => {
  await page.goto(`${APP}/post`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: /post job/i })).toBeVisible();
  // Either the cascading selects exist, or the fallback text inputs do:
  const hasWidget = await page.locator('select[name="city"]').count();
  if (!hasWidget) {
    await expect(page.getByPlaceholder(/Region/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Province|Metro/i)).toBeVisible();
    await expect(page.getByPlaceholder(/City/i)).toBeVisible();
  }
});
