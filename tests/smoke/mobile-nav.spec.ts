import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test('mobile nav ▸ post a job', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/browse-jobs\/?$/);
  await page.getByTestId('mobile-menu').click();
  await page.getByRole('link', { name: /post a job/i }).click();
  await expect(page).toHaveURL(/\/gigs\/create\/?$/);
});

