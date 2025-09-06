import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const link = page.getByTestId('nav-post-job');
  await expect(link).toBeVisible();
  await Promise.all([page.waitForLoadState('domcontentloaded'), link.click()]);
  await expectAuthAwareRedirect(page, '/post-job');
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const link = page.getByTestId('nav-my-applications');
  await expect(link).toBeVisible();
  await Promise.all([page.waitForLoadState('domcontentloaded'), link.click()]);
  await expectAuthAwareRedirect(page, '/applications');
});
