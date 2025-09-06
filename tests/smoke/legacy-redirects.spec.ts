import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('legacy /find redirects to /browse-jobs', async ({ page }) => {
  await page.goto('/find');
  await expect(page).toHaveURL(/\/browse-jobs\/?$/);
});

test('legacy /gigs/create redirects to /post-job', async ({ page }) => {
  await page.goto('/gigs/create');
  await expect(page).toHaveURL(/\/post-job\/?$/);
});
