import { test, expect } from '@playwright/test';
import { openMobileMenu } from './_helpers';

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  await openMobileMenu(page);
  await expect(page.getByRole('link', { name: /browse jobs/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /post a job/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /my applications/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
});
