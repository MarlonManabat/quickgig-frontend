import { test, expect } from '@playwright/test';

test('Hero → Browse jobs works', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByTestId('hero-browse-jobs').click();
  await expect(page).toHaveURL(/\/browse-jobs/);
  await expect(page.getByRole('heading', { name: /browse jobs/i })).toBeVisible();
});

test('Hero → Post a job works (shell)', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByTestId('hero-post-job').click();
  await expect(page).toHaveURL(/\/post-job/); // adjust if your path differs
  await expect(page.getByRole('heading')).toBeVisible();
});
