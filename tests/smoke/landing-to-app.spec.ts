import { test, expect } from '@playwright/test';
import { expectHref, reAuthAware } from './_helpers';

test('Landing → App CTAs · "Post a job" href', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-start')).toBeVisible();
  await expectHref(page.getByTestId('hero-cta-post-job'), reAuthAware('/post-jobs'));
});

test('Landing → App CTAs · "My Applications" href', async ({ page }) => {
  await page.goto('/');
  await expectHref(
    page.getByTestId('hero-cta-my-applications'),
    reAuthAware('/applications')
  );
});
