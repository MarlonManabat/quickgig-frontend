import { test } from '@playwright/test';
import { expectHref, LOGIN_OR_PKCE } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('nav-post-job');
  await expectHref(cta, LOGIN_OR_PKCE);
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('nav-my-applications');
  await expectHref(cta, LOGIN_OR_PKCE);
});
