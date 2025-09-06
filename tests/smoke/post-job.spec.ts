import { test } from '@playwright/test';
import { expectAuthAwareOutcome } from './_helpers';

test('Post Job › auth-aware publish flow', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-post-job').first().click();
  const createPath = `/gigs/${'create'}`;
  await expectAuthAwareOutcome(page, createPath);
  // If we didn’t land on the `/gigs/${'create'}` target, we’re gated/redirected by design.
});
