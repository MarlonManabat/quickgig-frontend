import { test, expect } from '@playwright/test';
import { expectHref } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('hero-cta-post-job');
  await expect(cta).toBeVisible();
  await expectHref(cta, /(\/post-jobs$|\/login\?next=\/post-jobs$)/);
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('hero-cta-my-applications');
  await expect(cta).toBeVisible();
  await expectHref(cta, /(\/applications$|\/login\?next=\/applications$)/);
});
