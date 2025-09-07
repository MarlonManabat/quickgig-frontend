import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test('Post Job › auth-aware publish flow', async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId('nav-post-job').first().click();
  const outcome = await expectAuthAwareRedirect(
    page,
    /\/(gigs\/create|login\?next=%2Fgigs%2Fcreate)$/
  );
  if (outcome === 'redirect') return; // unauth path in CI is OK — stop here

  // Authenticated path (local dev) — keep a fast publish flow
  await page.getByPlaceholder('Job title').fill(`Test Job ${Date.now()}`);
  await page.getByPlaceholder('Describe the work').fill('desc');
  await page.getByTestId('select-region').selectOption({ index: 1 });
  await page.locator('[data-testid="select-city"] option').first().waitFor();
  await page.getByTestId('post-job-submit').click();
  await expect(page.getByTestId('job-success')).toBeVisible({ timeout: 10_000 });
});
