import { test, expect } from '@playwright/test';
import { APP_HOST, expectAuthAwareRedirect } from '../e2e/helpers';

test.describe('Landing → App CTAs', () => {
  test('“Post a job” opens on app host', async ({ page }) => {
    await page.goto('/smoke/landing-ctas');
    await expect(
      page.getByRole('heading', { name: 'Smoke: Landing CTAs' })
    ).toBeVisible();
    const link = page.locator('[data-testid="cta-post-job"]');
    await expect(link).toBeVisible();
    await link.click();
    await expectAuthAwareRedirect(
      page,
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
    await link.click();
    await expectAuthAwareRedirect(
      page,
      new RegExp(`${APP_HOST.source}\/applications\/?$`)
    );
  });
});
