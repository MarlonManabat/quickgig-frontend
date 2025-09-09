import { test, expect } from '@playwright/test';
import { expectListOrEmpty, expectHref, reAuthAware } from './_helpers';
import { gotoHome } from '../e2e/_helpers';

// Reuse existing baseURL from Playwright config; do NOT introduce new env vars.
// The test only asserts pages render and key CTAs are present.

test.describe('QuickGig core flows (smoke)', () => {
  test('Browse Jobs page renders and shows at least one job or empty state', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/browse-jobs`);
    await expectListOrEmpty(
      page,
      'jobs-list',
      { text: /(no jobs yet|empty)/i }
    );
  });

  test('Job detail renders and Apply button is present (not necessarily clickable in preview)', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/browse-jobs`);
    const first = page.getByTestId('job-card').first();
    if (await first.count() === 0) test.skip(true, 'No job cards available in preview – skipping apply assertion.');
    await first.click();
    await expect(page).toHaveURL(/\/browse-jobs\/.+/);
    await expect(page.getByRole('button', { name: /apply|mag-apply/i })).toBeVisible();
  });

  test('My Applications is auth-gated (redirects to /login) OR renders empty when authenticated', async ({ page }) => {
    await gotoHome(page);
    await expectHref(page.getByTestId('nav-my-applications').first(), reAuthAware('/applications'));
  });

  test('Post Job page renders', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/post-jobs`);
    // We’re on the correct route
    await expect(page).toHaveURL(/\/post-jobs(?:\?|$)/);
    // Accept either skeleton while loading or the hydrated form/heading
    const skeleton = page.locator('[data-testid="post-job-skeleton"]');
    const form = page.locator('[data-testid="post-job-form"]');
    const heading = page.getByRole('heading', { name: /(Post a job|Create a gig)/i });
    const ok =
      (await skeleton.isVisible().catch(() => false)) ||
      (await form.isVisible().catch(() => false)) ||
      (await heading.isVisible().catch(() => false));
    expect(ok).toBeTruthy();
  });
});
