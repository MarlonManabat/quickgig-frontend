import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await page.goto('/applications', { waitUntil: 'domcontentloaded' });
  await expectAuthAwareRedirect(page, '/applications');
  if ((await page.url()).endsWith('/applications')) {
    await expect(page.getByTestId('applications-list')).toBeVisible();
    const rows = await page.getByTestId('application-row').count();
    if (rows === 0) {
      const empty = page.locator('[data-qa="applications-empty"], [data-testid="applications-empty"]');
      await expect(empty.first()).toBeVisible();
    }
  }
});
