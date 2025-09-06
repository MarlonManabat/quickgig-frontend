import { test, expect } from '@playwright/test';
import { gotoHome, expectVisibleOrAuthRedirect } from './_helpers';

test.describe('Applications page renders or redirects', () => {
  test('Applications page renders or redirects', async ({ page }) => {
    await gotoHome(page);
    await page.goto('/applications');
    const state = await expectVisibleOrAuthRedirect(
      page,
      page.getByTestId('applications-list'),
      '/applications'
    );
    if (state === 'redirect') return; // not logged in in CI mock; stop here

    const rows = await page.getByTestId('application-row').count();
    if (rows === 0) {
      const empty = page.locator('[data-qa="applications-empty"], [data-testid="applications-empty"]');
      await expect(empty).toBeVisible();
    }
  });
});
