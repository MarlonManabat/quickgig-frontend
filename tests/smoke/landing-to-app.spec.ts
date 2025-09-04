import { test, expect } from '@playwright/test';

const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;

test.describe('Landing → App CTAs', () => {
  test('“Post a job” opens on app host', async ({ page }) => {
    await page.goto('/smoke/landing-ctas');
    await expect(
      page.getByRole('heading', { name: 'Smoke: Landing CTAs' })
    ).toBeVisible();
    const link = page.locator('[data-testid="cta-post-job"]');
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
    await expect(page).toHaveURL(
      new RegExp(`${APP_HOST.source}\/gigs\/create\/?$`)
    );
  });

  test('“My Applications” opens on app host', async ({ page }) => {
    await page.goto('/smoke/landing-ctas');
    await expect(
      page.getByRole('heading', { name: 'Smoke: Landing CTAs' })
    ).toBeVisible();
    const link = page.locator('[data-testid="cta-my-applications"]');
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
    await expect(page).toHaveURL(
      new RegExp(`${APP_HOST.source}\/(applications|login)\/?$`)
    );
  });
});
