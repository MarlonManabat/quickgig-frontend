import { expect, test } from '@playwright/test';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('hero-sign-in')).toBeVisible();
  await page.getByTestId('hero-browse-jobs').click();
  await expect(page).toHaveURL(/\/browse-jobs/);
});
