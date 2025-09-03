import { test, expect } from '@playwright/test';

// Allow overriding in CI if needed
const BASE = process.env.BASE_URL ?? 'https://quickgig.ph';

// Accept production app host, localhost (dev), or path-only URLs
const HOST_RE = new RegExp('^(https://app\\.quickgig\\.ph|http://localhost:3000)?');

// Map link text (as visible on the landing) to expected app URL patterns
const cases: Array<[string, RegExp]> = [
  ['Browse jobs', new RegExp(`${HOST_RE.source}/browse-jobs/?$`)],
  ['Post a job', new RegExp(`${HOST_RE.source}/gigs/create/?$`)],
  ['My Applications', new RegExp(`${HOST_RE.source}/applications/?$`)],
  ['Sign in', new RegExp(`${HOST_RE.source}/(login|sign-in)/?$`)],
];

test.describe('Landing → App CTAs', () => {
  for (const [label, pattern] of cases) {
      test(`"${label}" opens on app host`, async ({ page }) => {
        await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
        const link = await page.getByRole('link', { name: new RegExp(label, 'i') }).first();
        await link.click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toMatch(pattern);
      });
  }
});
