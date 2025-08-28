import { expect, Page, APIRequestContext } from '@playwright/test';

export async function loginAs(page: Page, role: 'worker' | 'employer' | 'admin') {
  const res = await page.request.post('/api/test/login', { data: { role } });
  expect(res.status(), 'login status').toBeLessThan(400);
}

export async function seedBasic(request: APIRequestContext) {
  const r = await request.post('/api/test/seed', { data: {} });
  expect(r.status(), 'seed status').toBeLessThan(400);
}

/**
 * Wait for the shell + router to be ready in CI.
 * Tries fast path, then a soft reload if hydration lagged.
 */
export async function waitForAppReady(page: Page) {
  // Let initial network settle (SSR + hydrations)
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});

  const headerSel = '[data-testid="app-header"]';

  // First attempt: expect header + main to exist/attach
  const header = page.locator(headerSel);
  const main = page.locator('main');
  const firstTry = Promise.all([
    header.first().waitFor({ state: 'visible', timeout: 10_000 }),
    main.first().waitFor({ state: 'attached', timeout: 10_000 }),
  ]);

  try {
    await firstTry;
    return;
  } catch {
    // Soft recover: sometimes hydration finishes only after a quick reload in CI
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
    await header.first().waitFor({ state: 'visible', timeout: 20_000 });
    await main.first().waitFor({ state: 'attached', timeout: 20_000 });
  }
}

/**
 * Navigates to /jobs/new and ensures the form is visible.
 * Retries once with a reload and re-navigation if the form didn’t hydrate in time.
 */
export async function ensureOnJobsNew(page: Page) {
  const formSel = '[data-testid="job-form"]';

  // Navigate and wait for route ready
  await page.goto('/jobs/new');
  await waitForAppReady(page);
  await page.waitForURL(/\/jobs\/new$/, { timeout: 15_000 }).catch(() => {});

  // First attempt: wait for job form
  try {
    await page.waitForSelector(formSel, { state: 'visible', timeout: 20_000 });
    return;
  } catch {}

  // Recover: reload and re-wait
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForAppReady(page);
  await page.waitForURL(/\/jobs\/new$/, { timeout: 15_000 }).catch(() => {});
  await page.waitForSelector(formSel, { state: 'visible', timeout: 40_000 });
}
