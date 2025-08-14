import { test, expect } from '@playwright/test';

const BASE_HOST = new URL(process.env.BASE || 'https://app.quickgig.ph').host;
function assertAppUrl(url: string) {
  expect(new URL(url).host).toBe(BASE_HOST);
}

test('post job form renders and validates', async ({ page }) => {
  await page.goto('/post-job');
  assertAppUrl(page.url());
  const title = page.getByLabel(/title/i);
  const desc = page.getByLabel(/description/i);
  const budget = page.getByLabel(/budget/i);
  await expect(title).toBeVisible();
  await expect(desc).toBeVisible();
  await expect(budget).toBeVisible();

  await title.fill('Test');
  await page.getByRole('button', { name: /submit|post/i }).click();
  await expect(page.getByText(/required/i)).toBeVisible();
});
