import { test, expect } from '@playwright/test';

const BASE_HOST = new URL(process.env.BASE || 'https://app.quickgig.ph').host;
function assertAppUrl(url: string) {
  expect(new URL(url).host).toBe(BASE_HOST);
}

test('job filters update results and open details', async ({ page }) => {
  await page.goto('/find-work');
  assertAppUrl(page.url());
  await expect(page.getByLabel(/category/i)).toBeVisible();
  await expect(page.getByLabel(/location/i)).toBeVisible();
  await expect(page.getByLabel(/budget/i)).toBeVisible();

  await page.getByLabel(/category/i).selectOption({ index: 1 });
  await page.getByRole('button', { name: /search|apply|filter/i }).click();
  assertAppUrl(page.url());
  await expect(page).toHaveURL(/find-work\?/);
  const first = page.getByRole('link').first();
  await expect(first).toBeVisible();
  await first.click();
  assertAppUrl(page.url());
  await expect(page.getByRole('heading')).toBeVisible();
  await expect(page.getByRole('button')).toBeVisible();
});
