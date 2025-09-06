import { test, expect } from '@playwright/test';
import { expectUrlOneOf } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await page.goto('/applications');
  await expectUrlOneOf(page, [
    /\/applications\/?$/,
    /\/login\?next=%2Fapplications$/,
    /\/browse-jobs\/?$/,
  ]);

  if (/\/applications\/?$/.test(page.url())) {
    await expect(page.getByTestId('applications-list')).toBeVisible();
  }
});
