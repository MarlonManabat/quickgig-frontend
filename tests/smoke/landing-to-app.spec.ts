import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test.describe('Landing ➜ App CTAs', () => {
  test('"Post a job" opens on app host', async ({ page }) => {
    await gotoHome(page);
    const header = page.getByTestId('app-header');
    await expect(header).toBeVisible();
    const link = header.getByTestId('nav-post-job');
    await expect(link).toBeVisible();
    await Promise.all([page.waitForLoadState('domcontentloaded'), link.click()]);
    await expectAuthAwareRedirect(page, /\/gigs\/create\/?$/);
  });

  test('"My Applications" opens on app host', async ({ page }) => {
    await gotoHome(page);
    const header = page.getByTestId('app-header');
    await expect(header).toBeVisible();
    const link = header.getByTestId('nav-my-applications');
    await expect(link).toBeVisible();
    await Promise.all([page.waitForLoadState('domcontentloaded'), link.click()]);
    await expectAuthAwareRedirect(page, /\/applications\/?$/);
  });
});
