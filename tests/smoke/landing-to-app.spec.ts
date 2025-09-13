import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, loginOr } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('nav-post-job');
  await expect(cta).toBeVisible();
  await cta.click();
  const destRe = /(\/gigs\/create\/?$|https?:\/\/app\.quickgig\.ph\/post-job\/?$)/;
  await expect(page).toHaveURL(new RegExp(`(?:https?:\/\/[^/]+)?${destRe.source}`), { timeout: 12000 });
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('nav-my-applications');
  await expect(cta).toBeVisible();
  await cta.click();
  await expectAuthAwareRedirect(page, loginOr(/\/applications$/));
});
