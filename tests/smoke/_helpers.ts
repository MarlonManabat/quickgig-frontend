import { expect, Page } from '@playwright/test';

export async function expectUrlOneOf(
  page: Page,
  patterns: (RegExp | string)[],
  timeout = 8000
) {
  const start = Date.now();
  // Poll for a matching URL until timeout
  while (Date.now() - start < timeout) {
    const url = page.url();
    const ok = patterns.some(p =>
      typeof p === 'string' ? url.includes(p) || url.startsWith(p) : p.test(url)
    );
    if (ok) return;
    await page.waitForTimeout(100);
  }
  // Final assert for good error messaging
  const url = page.url();
  expect(
    patterns.some(p =>
      typeof p === 'string' ? url.includes(p) || url.startsWith(p) : p.test(url)
    ),
  ).toBeTruthy();
}

// Convenience for auth-aware links in CI (unauth).
export async function expectAuthAwareOutcome(
  page: Page,
  path: string, // e.g. '/applications' or `/gigs/${'create'}`
  timeout = 8000
) {
  const encoded = encodeURIComponent(path);
  await expectUrlOneOf(page, [
    new RegExp(`/login\\?next=${encoded}$`),  // classic auth redirect
    new RegExp(`${path}$`),                   // already authenticated (local)
    /\/browse-jobs\/?$/,                      // Good Product gate for guests
  ], timeout);
}

export async function gotoHome(page: Page) {
  // "/" now redirects; normalize and assert we end on /browse-jobs
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/browse-jobs\/?$/);
}
