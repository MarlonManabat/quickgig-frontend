import { test, expect } from '@playwright/test';
import { expectListOrEmpty, expectAuthAwareRedirect, loginOr, expectToBeOnRoute, visByTestId } from './_helpers';

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
    const cards = page.getByTestId('job-card');
    if ((await cards.count()) === 0) test.skip(true, 'No job cards available in preview – skipping apply assertion.');
    await cards.first().click();
    await expectToBeOnRoute(page, /\/browse-jobs\/.+/);
    await visByTestId(page, 'apply-button');
  });

  test('My Applications is auth-gated (redirects to /login) OR renders empty when authenticated', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/`);
    await (await visByTestId(page, 'nav-my-applications')).click();
    await expectAuthAwareRedirect(page, loginOr(/\/applications$/));
  });

  test('Post Job page renders', async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ''}/gigs/create`);
    // We’re on the correct route
    await expectToBeOnRoute(page, '/gigs/create');
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
