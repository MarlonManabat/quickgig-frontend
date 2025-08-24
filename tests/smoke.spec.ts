import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL ?? 'https://app.quickgig.ph';
const appRootRe = new RegExp(`^${APP_URL.replace('.', '\.').replace('/', '\/')}\/?(?:[?#].*)?$`, 'i');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');

  // ---- Find work CTA (accept: "Find work" | "Browse jobs" | "Maghanap ng Trabaho") ----
  const ctaText = /find work|browse jobs|maghanap ng trabaho/i;
  const findWorkCta = page.locator('a, button').filter({ hasText: ctaText }).first();
  await expect(findWorkCta, 'landing CTA should be visible').toBeVisible();
  const tag = await findWorkCta.evaluate((n) => n.tagName.toLowerCase());
  if (tag === 'a') {
    await expect(findWorkCta).toHaveAttribute('href', appRootRe);
  } else {
    await Promise.all([
      page.waitForURL(appRootRe),
      findWorkCta.click(),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  }

  // ---- Post job CTA (same pattern) ----
  const postJobCta = page.locator('a, button').filter({ hasText: /post job/i }).first();
  await expect(postJobCta, 'post job CTA should be visible').toBeVisible();
  const postTag = await postJobCta.evaluate((n) => n.tagName.toLowerCase());
  if (postTag === 'a') {
    await expect(postJobCta).toHaveAttribute('href', appRootRe);
  } else {
    await Promise.all([
      page.waitForURL(appRootRe),
      postJobCta.click(),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  }

  // ---- Header logo (prefer href, else click) ----
  const logo = page
    .locator('a[aria-label="QuickGig"], a[aria-label="QuickGig.ph"], header a:has(img), header button:has(img)')
    .first();
  await expect(logo, 'header logo should be visible').toBeVisible();
  const logoTag = await logo.evaluate((n) => n.tagName.toLowerCase());
  if (logoTag === 'a') {
    await expect(logo).toHaveAttribute('href', appRootRe);
  } else {
    await Promise.all([
      page.waitForURL(appRootRe),
      logo.click(),
    ]);
  }
});
