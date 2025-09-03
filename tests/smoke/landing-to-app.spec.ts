import { test, expect } from '@playwright/test';

// Allow overriding in CI if needed
const BASE = process.env.BASE_URL ?? 'https://quickgig.ph';
const APP  = process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'https://app.quickgig.ph';

// Map link text (as visible on the landing) to expected app URL patterns
const cases: Array<[string, string | RegExp]> = [
  ['Browse jobs',        new RegExp(`^${APP.replace('.', '\\.')}/browse-jobs`)],
  ['Post a job',         new RegExp(`^${APP.replace('.', '\\.')}/gigs/create`)],
  ['My Applications',    new RegExp(`^${APP.replace('.', '\\.')}/applications`)],
  ['Sign in',            new RegExp(`^${APP.replace('.', '\\.')}/(login|sign-in)`)],
];

test.describe('Landing → App CTAs', () => {
  for (const [label, pattern] of cases) {
    test(`"${label}" opens on app host`, async ({ page }) => {
      await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
      // Try exact role/name first, then a fallback for absolute cross-origin href
      const link = await page.getByRole('link', { name: new RegExp(label, 'i') })
        .or(page.locator(`a[href^="${APP}"]`))
        .first();
      await link.click();
      await page.waitForLoadState('domcontentloaded');
      expect(page.url()).toMatch(pattern);
    });
  }
});
