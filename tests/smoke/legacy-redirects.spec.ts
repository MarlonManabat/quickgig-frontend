import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('legacy /find redirects to /browse-jobs', async ({ page }) => {
  await page.goto('/find');
  await expect(page).toHaveURL(/\/browse-jobs\/?$/);
});

test('legacy /post-job redirects to create (auth-aware)', async ({ page }) => {
  await page.goto('/post-job');
  await expectAuthAwareRedirect(page, /\/gigs\/create\/?$/);
});
