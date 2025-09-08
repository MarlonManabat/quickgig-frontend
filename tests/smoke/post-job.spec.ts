import { test } from '@playwright/test';
import { expectHref } from './_helpers';

test('Post Job CTA points to gig creation', async ({ page }) => {
  await page.goto('/post-jobs');
  await expectHref(page.getByTestId('publish-gig'), /(\/gigs\/create\/?$|\/login\?next=\/gigs\/create\/?$)/);
});

