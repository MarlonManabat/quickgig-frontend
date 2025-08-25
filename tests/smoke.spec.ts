import { test, expect } from '@playwright/test';
import { getDemoEmail, stubSignIn } from './utils/session';

const APP_URL =
  process.env.APP_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'https://app.quickgig.ph';

const esc = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
const base = APP_URL.replace(/\/+$/, '');

// Accept root with optional query/fragment
const rootRe = new RegExp(`^${esc(base)}/?(?:[?#].*)?$`, 'i');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
});

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');

  const checkCta = async (name: RegExp) => {
    const cta = page.getByRole('link', { name }).first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    const href = await cta.getAttribute('href');
    console.log('[smoke] CTA href:', href);
    expect(href, 'href should exist').not.toBeNull();
    const before = page.url();
    await Promise.all([
      cta.click(),
      page.waitForURL((url) => url.href !== before, { timeout: 10_000 }).catch(() => {}),
    ]);
    await page.goBack({ waitUntil: 'load' }).catch(() => {});
  };

  await checkCta(/simulan na/i);
  await checkCta(/post job/i);
  await checkCta(/sign up/i);

  // ---- Header logo (prefer href, else click) ----
  const logoLink = page
    .locator('a[aria-label="QuickGig"], a[aria-label="QuickGig.ph"], header a:has(img)')
    .first();
  if (await logoLink.isVisible().catch(() => false)) {
    await expect(logoLink).toBeVisible({ timeout: 10000 });
    const href = await logoLink.getAttribute('href');
    const resolvedHref = href ? new URL(href, `${base}/`).href : href;
    console.log('[smoke] Logo href:', href, '->', resolvedHref);
    expect(href, 'href should exist').not.toBeNull();
    expect(href === '/' || rootRe.test(href!)).toBeTruthy();
  } else {
    const logoBtn = page.locator('header button:has(img)').first();
    await expect(logoBtn).toBeVisible({ timeout: 10000 });
    await Promise.all([
      page.waitForURL(rootRe, { timeout: 10_000 }),
      logoBtn.click(),
    ]);
  }
});

test(
  'app notifications bell visible after login (skips if no demo creds)',
  async ({ page }) => {
    const email = getDemoEmail('user');
    test.skip(
      !email,
      'No demo user email available via env or optional fixture',
    );

    await stubSignIn(page, email!);
    await page.goto(APP_URL + '/');

    // Use your actual selector for the notifications bell:
    const bell = page.getByRole('button', { name: /notifications/i }).first();
    await expect(bell).toBeVisible();
  },
);

test('wallet submit visible after login (skips if no demo creds)', async ({ page }) => {
  const email = getDemoEmail('user');
  test.skip(!email, 'No demo user email available via env or optional fixture');
  await stubSignIn(page, email!);
  await page.goto(APP_URL + '/wallet');
  await expect(page.getByTestId('submit-receipt')).toBeVisible();
});
