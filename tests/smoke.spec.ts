import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL ?? 'https://app.quickgig.ph';
const escapedAppUrl = APP_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const appRootRe = new RegExp('^' + escapedAppUrl + '/?$', 'i');
const appPostRe = new RegExp('^' + escapedAppUrl + '/post/?$', 'i');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');

  // ---- Find work CTA (accept: "Find work" | "Browse jobs" | "Maghanap ng Trabaho") ----
  const ctaText = /find work|browse jobs|maghanap ng trabaho/i;
  const findWorkCta = page.locator('a,button').filter({ hasText: ctaText }).first();
  await expect(findWorkCta).toBeVisible({ timeout: 15000 });
  const ctaTag = await findWorkCta.evaluate(n => n.tagName.toLowerCase());
  if (ctaTag === 'a') {
    const href = await findWorkCta.getAttribute('href');
    console.log('[smoke] CTA <a> href:', href);
    await expect(findWorkCta).toHaveAttribute('href', appRootRe);
  } else {
    console.log('[smoke] CTA <' + ctaTag + '> click');
    await Promise.all([
      page.waitForURL(appRootRe, { timeout: 15000 }),
      findWorkCta.click(),
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
    expect(href!).toMatch(appPostRe);
  } else {
    const postJobBtn = page.getByRole('button', { name: /post job/i });
    await expect(postJobBtn).toBeVisible();
    await Promise.all([
      page.waitForURL(appPostRe),
      postJobBtn.click(),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  }

  // ---- Header logo (prefer href, else click) ----
  const headerLogo = page
    .locator('header a:has(img), header button:has(img), header a:has-text(/QuickGig(\\.ph)?/i), header button:has-text(/QuickGig(\\.ph)?/i)')
    .first();
  await expect(headerLogo).toBeVisible({ timeout: 15000 });
  const logoTag = await headerLogo.evaluate(n => n.tagName.toLowerCase());
  if (logoTag === 'a') {
    const href = await headerLogo.getAttribute('href');
    console.log('[smoke] Logo <a> href:', href);
    await expect(headerLogo).toHaveAttribute('href', appRootRe);
  } else {
    console.log('[smoke] Logo <' + logoTag + '> click');
    await Promise.all([
      page.waitForURL(appRootRe, { timeout: 15000 }),
      headerLogo.click(),
    ]);
  }
});
