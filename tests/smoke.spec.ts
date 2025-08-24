import { test, expect } from '@playwright/test';

const APP_URL =
  process.env.APP_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'https://app.quickgig.ph';

// Accept root (with optional query/fragment)
const rootRe = new RegExp(
  `^${APP_URL.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}/?(?:[?#].*)?$`,
  'i'
);

// TEMP: accept legacy /post as we roll out landing change + app redirect
const postRe = new RegExp(
  `^${APP_URL.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}/post(?:[?#].*)?$`,
  'i'
);

const acceptable = (href: string) => rootRe.test(href) || postRe.test(href); // TODO: remove postRe soon

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
    expect(acceptable(href ?? '')).toBeTruthy(); // TODO: tighten to rootRe only after deploy settles
  } else {
    await Promise.all([
      page.waitForURL(rootRe, { timeout: 10_000 }),
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
    expect(acceptable(href ?? '')).toBeTruthy(); // TODO: tighten to rootRe only after deploy settles
  } else {
    await Promise.all([
      page.waitForURL(rootRe, { timeout: 10_000 }),
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
      page.waitForURL(rootRe, { timeout: 10_000 }),
      logoBtn.click(),
    ]);
  }
});
