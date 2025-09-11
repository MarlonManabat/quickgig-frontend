import { test } from '@playwright/test';
import { expectHref, rePath } from './_helpers';

test('Landing → App CTAs: "Post a job" href', async ({ page }) => {
  await page.goto('/');
  await expectHref(page.getByTestId('hero-cta-post-job').first(), rePath('/post-jobs'));
});

test('Landing → App CTAs: "My Applications" href', async ({ page }) => {
  await page.goto('/');
  await expectHref(page.getByTestId('hero-cta-applications').first(), rePath('/applications'));
});
