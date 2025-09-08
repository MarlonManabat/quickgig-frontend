import { test, expect } from "@playwright/test";

// Reuse existing baseURL from Playwright config; do NOT introduce new env vars.
// The test only asserts pages render and key CTAs are present.

test.describe("QuickGig core flows (smoke)", () => {
  test("Browse Jobs page renders and shows at least one job or empty state", async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ""}/browse-jobs`);
    // Either job cards exist or an empty state is visible
    const hasCards = await page.locator('[data-testid="job-card"], [data-test="job-card"]').first().isVisible().catch(() => false);
    const hasEmpty = await page.getByText(/no jobs yet|wala pang jobs|empty state/i).first().isVisible().catch(() => false);
    expect(hasCards || hasEmpty).toBeTruthy();
  });

  test("Job detail renders and Apply button is present (not necessarily clickable in preview)", async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ""}/browse-jobs`);
    const firstCard = page.locator('[data-testid="job-card"], [data-test="job-card"]').first();
    if (await firstCard.count()) {
      await firstCard.click();
    } else {
      // fallback: direct to a seeded preview detail if available; tolerate 404
      await page.goto(`${baseURL || ""}/browse-jobs/preview`);
    }
    await expect(page).toHaveURL(/\/browse-jobs\/.+/);
    await expect(page.getByRole("button", { name: /apply|mag-apply/i })).toBeVisible();
  });

  test("My Applications is auth-gated (redirects to /login) OR renders with empty state/list when authenticated", async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ""}/applications`);
    await page.waitForLoadState("domcontentloaded");
    const urlNow = page.url();
    if (/\/login(\?|$)/.test(urlNow)) {
      // Auth redirect is expected for signed-out preview; treat as pass.
      expect(true).toBeTruthy();
      return;
    }
    const hasRows = await page.locator('[data-testid="application-row"]').first().isVisible().catch(() => false);
    const hasEmpty = await page.getByText(/no applications yet|wala pang application|empty state/i).first().isVisible().catch(() => false);
    expect(hasRows || hasEmpty).toBeTruthy();
  });

  test("Post Job page renders", async ({ page, baseURL }) => {
    await page.goto(`${baseURL || ""}/post-job`);
    await expect(page.getByRole("heading", { name: /post a job|create job|mag-post/i })).toBeVisible();
  });
});
