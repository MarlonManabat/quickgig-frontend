import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test('Landing → Browse → open job → Apply (auth-aware)', async ({ page }) => {
  await gotoHome(page);
  // browse list has seed data; open the first job card
  const first = page.getByTestId('job-card').first();
  await first.click();
  await expect(page.getByTestId('apply-button')).toBeVisible();

  await page.getByTestId('apply-button').click();
  await expectAuthAwareRedirect(page, /\/applications\/?$/);
});
