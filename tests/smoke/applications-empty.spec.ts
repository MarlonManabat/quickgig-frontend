import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await gotoHome(page);
  const header = page.getByTestId('app-header');
  await expect(header).toBeVisible();
  await header.getByTestId('nav-my-applications').click();

  await expectAuthAwareRedirect(page, '/applications');

  if ((await page.url()).endsWith('/applications')) {
    await expect(
      page.locator('[data-testid="applications-empty"], [data-testid="applications-list"]')
    ).toBeVisible();
  }
});
