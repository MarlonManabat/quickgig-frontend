import { test, expect } from '@playwright/test';
import { getAppRoot } from '../lib/appUrl';

process.env.NEXT_PUBLIC_APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
const APP_ROOT = getAppRoot();
const escapedRoot = APP_ROOT.replace(/\./g, '\.').replace(/\//g, '\/');
const appRootRe = new RegExp(`^${escapedRoot}/?$`, 'i');
const appRootOrFindRe = new RegExp(`^${escapedRoot}(?:/find)?/?$`, 'i');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  // ---- Find work CTA (accept: "Find work" | "Browse jobs" | "Maghanap ng Trabaho") ----
  const cta = page.getByRole('link', { name: /find work|browse jobs|maghanap ng trabaho/i }).first();
  await expect(cta).toBeVisible();
  const ctaText = await cta.innerText();
  const ctaHref = await cta.getAttribute('href');
  console.log('[smoke] CTA text:', ctaText, 'href:', ctaHref);
  await expect(cta).toHaveAttribute('href', appRootOrFindRe);

  // ---- Post job CTA ----
  const post = page.getByRole('link', { name: /post job/i }).first();
  if (await post.isVisible().catch(() => false)) {
    await expect(post).toBeVisible();
    const text = await post.innerText();
    const href = await post.getAttribute('href');
    console.log('[smoke] Post job text:', text, 'href:', href);
    await expect(post).toHaveAttribute('href', appRootRe);
  }

  // ---- Header logo ----
  const logo = page
    .locator('a[aria-label="QuickGig"], a[aria-label="QuickGig.ph"], header a:has(img)')
    .first();
  await expect(logo).toBeVisible();
  const logoHref = await logo.getAttribute('href');
  console.log('[smoke] Logo href:', logoHref);
  await expect(logo).toHaveAttribute('href', appRootOrFindRe);
});
