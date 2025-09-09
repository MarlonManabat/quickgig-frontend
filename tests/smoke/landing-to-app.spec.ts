import { test } from '@playwright/test';
import { expectAuthAwareHref } from './_helpers';

test('Landing → App CTAs · "Post a job" href', async ({ page }) => {
  await page.goto('/');
  await expectAuthAwareHref(page.getByTestId('hero-cta-post-job'), '/post-jobs');
});

test('Landing → App CTAs · "My Applications" href', async ({ page }) => {
  await page.goto('/');
  await expectAuthAwareHref(
    page.getByTestId('hero-cta-my-applications'),
    '/applications'
  );
});
