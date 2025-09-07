import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await page.goto('/applications');
  await expectAuthAwareRedirect(page, '/applications');
  if ((await page.url()).endsWith('/applications')) {
    await expect(page.getByTestId('applications-list')).toBeVisible();
  }
});
