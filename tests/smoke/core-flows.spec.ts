import { test } from '@playwright/test';
import { expectAuthAwareHref } from './_helpers';

test('QuickGig core flows (smoke) › My Applications is auth-gated (href contract)', async ({ page }) => {
  await page.goto('/');
  await expectAuthAwareHref(page, 'nav-my-applications', '/applications');
});
