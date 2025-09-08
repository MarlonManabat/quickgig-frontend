import { test } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await page.goto('/applications');
  await expectAuthAwareRedirect(page, /\/applications$/);
  // If CI redirected to login, we're done. If we landed on /applications without auth, do not
  // require the list to be visible (it may be hidden for guests).
  // No further assertion needed here.
});

