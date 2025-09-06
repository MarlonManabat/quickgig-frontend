import { expect, Page, Locator } from '@playwright/test';

// Navigates to home in either local dev or CI.
export async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

/**
 * For auth-aware pages, succeed if either the target element becomes visible
 * OR the app redirects to /login?next=<path>.
 * Returns 'visible' | 'redirect' so the caller can continue or early-return.
 */
export async function expectVisibleOrAuthRedirect(
  page: Page,
  locator: Locator | (() => Locator),
  path: string,
  timeout = 8000
): Promise<'visible' | 'redirect'> {
  const target = typeof locator === 'function' ? locator() : locator;
  const encoded = encodeURIComponent(path);
  const re = new RegExp(`/login\\?next=${encoded}$`);

  const winner = await Promise.race([
    target.waitFor({ state: 'visible', timeout }).then(() => 'visible' as const),
    page.waitForURL(re, { timeout }).then(() => 'redirect' as const),
  ]);

  if (winner === 'visible') {
    await expect(target).toBeVisible();
    return 'visible';
  }
  await expect(page).toHaveURL(re);
  return 'redirect';
}

// Keep a simple redirect helper for direct assertions when no element is involved.
export async function expectAuthAwareRedirect(page: Page, path: string, timeout = 8000) {
  const re = new RegExp(`/login\\?next=${encodeURIComponent(path)}$`);
  await expect(page).toHaveURL(re, { timeout });
}
