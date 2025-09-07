import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Applications page renders or redirects', async ({ page }) => {
  await page.goto('/applications');
  const result = await expectAuthAwareRedirect(page, '/applications');
  if (result === 'landed') {
    await expect(page.getByTestId('applications-list')).toBeVisible();
  }
});
