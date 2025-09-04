import { test, expect } from '@playwright/test';

const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;

test.describe('Landing → App CTAs', () => {
  test('“Post a job” opens on app host', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('[data-testid="cta-post-job"]');
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
    await expect(page.url()).toMatch(new RegExp(`${APP_HOST.source}\/gigs\/create\/?$`));
  });

  test('“My Applications” opens on app host', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('[data-testid="cta-my-applications"]');
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
    await expect(page.url()).toMatch(new RegExp(`${APP_HOST.source}\/applications\/?$`));
    // Note: if your app shows an auth gate on /applications, that’s fine;
    // the URL must still be /applications, not a redirect to /browse-jobs.
  });
});
