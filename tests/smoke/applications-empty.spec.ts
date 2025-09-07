import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await page.goto('/applications');
  await expectAuthAwareRedirect(page, '/applications');
  if (/\/applications$/.test(page.url())) {
    await expect(page.getByTestId('applications-list')).toBeVisible();
  }
});
