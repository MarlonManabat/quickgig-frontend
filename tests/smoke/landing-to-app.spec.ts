import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, loginOr, visByTestId } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = await visByTestId(page, 'nav-post-job');
  await cta.click();
  const destRe = /(?:\/gigs\/create\/?$)|(?:\/post-job\/?$)|(?:https?:\/\/app\.quickgig\.ph\/post-job\/?$)/;
  await expectAuthAwareRedirect(page, destRe);
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = await visByTestId(page, 'nav-my-applications');
  await cta.click();
  await expectAuthAwareRedirect(page, loginOr(/\/applications$/));
});
