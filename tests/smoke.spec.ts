import { test, expect } from '@playwright/test';

const appUrl = (process.env.APP_URL || 'https://app.quickgig.ph').replace(/\/+$/, '');
const rootRe = new RegExp(`^${appUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}/?$`, 'i');
const findRe = new RegExp(`^${appUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}/find/?$`, 'i');
const acceptable = (href?: string | null) => !!href && (rootRe.test(href) || findRe.test(href));

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');

  // ---- Find work CTA (accept: "Find work" | "Browse jobs" | "Maghanap ng Trabaho") ----
  const ctaText = /find work|browse jobs|maghanap ng trabaho/i;
  const cta = page.locator('a,button').filter({ hasText: ctaText }).first();
  await expect(cta).toBeVisible({ timeout: 10000 });
  const tag = await cta.evaluate((n) => n.tagName.toLowerCase());

  if (tag === 'a') {
    const href = await cta.getAttribute('href');
    console.log('[smoke] Found CTA link:', href);
    expect(acceptable(href)).toBeTruthy(); // TODO: tighten to rootRe next PR
  } else {
    await Promise.all([
      page.waitForURL(rootRe, { timeout: 10000 }),
      cta.click(),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  }

  // ---- Post job CTA ----
  const postCta = page.locator('a,button').filter({ hasText: /post job/i }).first();
  await expect(postCta).toBeVisible({ timeout: 10000 });
  const postTag = await postCta.evaluate((n) => n.tagName.toLowerCase());
  if (postTag === 'a') {
    const href = await postCta.getAttribute('href');
    console.log('[smoke] Found CTA link:', href);
    expect(acceptable(href)).toBeTruthy(); // TODO: tighten to rootRe next PR
  } else {
    await Promise.all([
      page.waitForURL(rootRe, { timeout: 10000 }),
      postCta.click(),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  }

  // ---- Header logo (prefer href, else click) ----
  const logoLink = page
    .locator('a[aria-label="QuickGig"], a[aria-label="QuickGig.ph"], header a:has(img)')
    .first();
  if (await logoLink.isVisible().catch(() => false)) {
    await expect(logoLink).toBeVisible({ timeout: 10000 });
    const href = await logoLink.getAttribute('href');
    console.log('[smoke] Found logo link:', href);
    expect(href, 'href should exist').not.toBeNull();
    expect(href!).toMatch(rootRe);
  } else {
    const logoBtn = page.locator('header button:has(img)').first();
    await expect(logoBtn).toBeVisible({ timeout: 10000 });
    await Promise.all([
      page.waitForURL(rootRe, { timeout: 10000 }),
      logoBtn.click(),
    ]);
  }
});
