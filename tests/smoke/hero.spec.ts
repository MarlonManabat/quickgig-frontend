import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test.describe('landing hero CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await page.goto('/smoke/landing-ctas');
    const browse = page.getByTestId('hero-browse-jobs');
    await expect(browse).toBeVisible();
    await browse.click();
    await expect(page).toHaveURL(/\/browse-jobs\/?/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await page.goto('/smoke/landing-ctas');
    const post = page.getByTestId('hero-post-job');
    await expect(post).toBeVisible();
    await post.click();
    await expectAuthAwareRedirect(page, /\/gigs\/create\/?/);
  });
});
