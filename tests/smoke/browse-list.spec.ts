import { test, expect } from '@playwright/test';

test('Browse list renders', async ({ page }) => {
  await page.goto('/browse-jobs');
  await expect(page.getByTestId('jobs-list')).toBeVisible();
  const count = await page.getByTestId('job-card').count();
  if (process.env.VERCEL_ENV !== 'production') {
    await expect(count).toBeGreaterThan(0);
  } else if (count === 0) {
    console.warn('No job cards found');
  }
});
