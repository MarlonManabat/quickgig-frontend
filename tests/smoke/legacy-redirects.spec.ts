import { test, expect } from '@playwright/test';
const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;

test('legacy /find redirects to /browse-jobs', async ({ page }) => {
  await page.goto('/find');
  await expect(page).toHaveURL(new RegExp(`${APP_HOST.source}\/browse-jobs\/?$`));
});

test('legacy /post-job redirects to /gigs/create', async ({ page }) => {
  await page.goto('/post-job');
  await expect(page).toHaveURL(new RegExp(`${APP_HOST.source}\/gigs\/create\/?$`));
});
