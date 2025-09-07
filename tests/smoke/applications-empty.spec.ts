import { test } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await page.goto('/applications');
  await expectAuthAwareRedirect(page, '/applications');
});
