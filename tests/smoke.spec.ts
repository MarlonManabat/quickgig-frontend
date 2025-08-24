import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL ?? 'https://app.quickgig.ph';
const escapeRe = (url: string) => url.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
const appRootRe = new RegExp(`^${escapeRe(APP_URL)}\\/?$`, 'i');
const appRootOrFindRe = new RegExp(`^${escapeRe(APP_URL)}/(find)?$`, 'i');
const appRootOrPostRe = new RegExp(`^${escapeRe(APP_URL)}/(post)?$`, 'i');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');

  // ---- Find work CTA (accept: "Find work" | "Browse jobs" | "Maghanap ng Trabaho") ----
  const ctaText = /find work|browse jobs|maghanap ng trabaho/i;
  const findWorkLink = page.getByRole('link', { name: ctaText });
  if (await findWorkLink.isVisible().catch(() => false)) {
    await expect(findWorkLink).toBeVisible();
    const href = await findWorkLink.getAttribute('href');
    console.log('[smoke] Found CTA link:', href);
    expect(href, 'href should exist').not.toBeNull();
    expect(href!).toMatch(appRootOrFindRe);
  } else {
    const findWorkBtn = page.getByRole('button', { name: ctaText });
    await expect(findWorkBtn).toBeVisible();
    await Promise.all([
      page.waitForURL(appRootOrFindRe),
      findWorkBtn.click(),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  }

  // ---- Post job CTA ----
  const postJobLink = page.getByRole('link', { name: /post job/i });
  if (await postJobLink.isVisible().catch(() => false)) {
    await expect(postJobLink).toBeVisible();
    const href = await postJobLink.getAttribute('href');
    console.log('[smoke] Found CTA link:', href);
    expect(href, 'href should exist').not.toBeNull();
    expect(href!).toMatch(appRootOrPostRe);
  } else {
    const postJobBtn = page.getByRole('button', { name: /post job/i });
    await expect(postJobBtn).toBeVisible();
    await Promise.all([
      page.waitForURL(appRootOrPostRe),
      postJobBtn.click(),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  }

  // ---- Header logo (prefer href, else click) ----
  const logoLink = page
    .locator('a[aria-label="QuickGig"], a[aria-label="QuickGig.ph"], header a:has(img)')
    .first();
  if (await logoLink.isVisible().catch(() => false)) {
    await expect(logoLink).toBeVisible();
    const href = await logoLink.getAttribute('href');
    console.log('[smoke] Found logo link:', href);
    expect(href, 'href should exist').not.toBeNull();
    expect(href!).toMatch(appRootRe);
  } else {
    const logoBtn = page.locator('header button:has(img)').first();
    await expect(logoBtn).toBeVisible();
    await Promise.all([
      page.waitForURL(appRootRe),
      logoBtn.click(),
    ]);
  }
});
