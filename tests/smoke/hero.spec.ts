import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from '../e2e/helpers';

test.describe('landing hero CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await page.goto('/smoke/landing-ctas');
    await page.getByTestId('hero-browse-jobs').click();
    await expect(page).toHaveURL(/\/browse-jobs/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await page.goto('/smoke/landing-ctas');
    await page.getByTestId('hero-post-job').click();
    await expectAuthAwareRedirect(page, /\/gigs\/create$/);
  });
});
