import { test, expect } from '@playwright/test';
import { expectListOrEmpty, expectAuthAwareRedirect } from './_helpers';

// Reuse existing baseURL from Playwright config; do NOT introduce new env vars.
// The test only asserts pages render and key CTAs are present.

test.describe('QuickGig core flows (smoke)', () => {
  test('Browse Jobs page renders and shows at least one job or empty state', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/browse-jobs`);
    await expectListOrEmpty(page, 'jobs-list', {
      itemTestId: 'job-card',
      emptyTestId: 'jobs-empty',
    });
  });

  test('Job detail renders and Apply button is present (not necessarily clickable in preview)', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/browse-jobs`);
    const first = page.getByTestId('job-card').first();
    if (await first.count() === 0) test.skip(true, 'No job cards available in preview – skipping apply assertion.');
    await first.click();
    await expect(page).toHaveURL(/\/browse-jobs\/.+/);
    await expect(page.getByRole('button', { name: /apply|mag-apply/i })).toBeVisible();
  });

  test('My Applications is auth-gated (redirects to /login) OR renders empty when authenticated', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/applications`);
    await expectAuthAwareRedirect(page, /\/applications$/);
  });

  test('Post Job page renders', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/post-job`);
    await expect(
      page
        .getByTestId('post-job-skeleton')
        .or(page.getByRole('heading', { name: /Post a Job/i }))
    ).toBeVisible();
  });
});
