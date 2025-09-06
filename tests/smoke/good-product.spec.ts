import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test.describe('good product smoke', () => {
  test('mobile › good product smoke', async ({ page }) => {
    await gotoHome(page);
    // Landing hero CTA -> Browse jobs (assert URL instead of element visibility; mobile may hide nav)
    await page.getByTestId('hero-browse-jobs').first().click();
    await expect(page).toHaveURL(/\/browse-jobs\/?$/);

    // Auth-aware nav CTAs should redirect to login in CI
    await page.getByTestId('nav-my-applications').first().click();
    await expectAuthAwareRedirect(page, '/applications');

    await page.goto('/browse-jobs');
    await page.getByTestId('nav-post-job').first().click();
    await expectAuthAwareRedirect(page, '/post-job');
  });

  test('desktop › good product smoke', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-browse-jobs').first().click();
    await expect(page).toHaveURL(/\/browse-jobs\/?$/);

    await page.getByTestId('nav-my-applications').first().click();
    await expectAuthAwareRedirect(page, '/applications');

    await page.goto('/browse-jobs');
    await page.getByTestId('nav-post-job').first().click();
    await expectAuthAwareRedirect(page, '/post-job');
  });
});
