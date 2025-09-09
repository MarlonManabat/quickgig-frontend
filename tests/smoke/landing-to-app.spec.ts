import { test } from '@playwright/test';
import { expectHref, expectAuthAwareHref, rePath } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await page.goto('/');
  await expectHref(page.getByTestId('nav-post-job').first(), rePath('/post-jobs'));
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await page.goto('/');
  await expectAuthAwareHref(page, 'nav-my-applications', '/applications');
});
