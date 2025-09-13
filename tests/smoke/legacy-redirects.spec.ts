import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, expectToBeOnRoute } from './_helpers';

test('legacy /find redirects to /browse-jobs', async ({ page }) => {
  await page.goto('/find');
  await expectToBeOnRoute(page, '/browse-jobs');
});

test('legacy /post-job redirects to /gigs/create', async ({ page }) => {
  await page.goto('/post-job');
  await expectToBeOnRoute(page, '/gigs/create');
});
