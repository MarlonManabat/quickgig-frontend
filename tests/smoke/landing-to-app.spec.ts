import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, clickIfSameOriginOrAssertHref, loginOr } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('nav-post-job');
  await expect(cta).toBeVisible();
  const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/post-job$/);
  if (navigated) {
    await expectAuthAwareRedirect(page, loginOr(/\/post-jobs?\/?$/));
  }
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('nav-my-applications');
  await expect(cta).toBeVisible();
  const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/applications$/);
  if (navigated) {
    await expectAuthAwareRedirect(page, loginOr(/\/applications$/));
  }
});
