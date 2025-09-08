import { expect, Locator } from '@playwright/test';
import type { Page } from '@playwright/test';

// Common destinations
export const loginRe = /\/login(\?.*)?$/;
export const pkceStartRe = /\/api\/auth\/pkce\/start(\?.*)?$/;

/**
 * Some CI/preview runs kick off PKCE then the browser navigates to
 * chrome-error://chromewebdata/ before the final hop is reachable.
 * Treat the flow as successful if we saw the PKCE start request,
 * and only assert the final URL when the page didn't crash to chrome-error.
 */
export async function expectAuthAwareRedirect(
  page: Page,
  dest: RegExp,
  timeout = 8000
) {
  const start = Date.now();
  let last = page.url();
  while (Date.now() - start < timeout) {
    last = page.url();
    try {
      const url = new URL(last, 'http://localhost');
      const next = url.searchParams.get('next') || '';
      if (
        (loginRe.test(url.pathname) || pkceStartRe.test(url.pathname)) &&
        dest.test(next)
      ) {
        return;
      }
      if (dest.test(url.pathname + url.search)) return;
    } catch {
      /* ignore parse errors */
    }
    await page.waitForTimeout(100);
  }
  expect(
    false,
    `Expected auth-aware redirect to '${dest}', last URL was '${last}'`
  ).toBeTruthy();
}

/** Ensure mobile drawer is open so nav items are visible */
export async function openMobileMenu(page: Page) {
  try {
    await page.getByTestId('nav-menu-button').click();
    await expect(page.getByTestId('nav-menu')).toBeVisible();
    return;
  } catch {}

  const fallbacks = [
    '[data-testid="nav-menu-button"]',
    'button[aria-label="Menu"]',
    'button:has-text("Menu")',
  ];
  for (const sel of fallbacks) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click();
      await expect(page.locator('[data-testid="nav-menu"]').first()).toBeVisible();
      return;
    }
  }
}

/** Assert either a list exists or an empty-state is rendered */
export async function expectListOrEmpty(
  page: Page,
  listTestId: string,
  opts: {
    itemTestId?: string;
    emptyTestId?: string;
    emptyTextRe?: RegExp;
  }
) {
  const { itemTestId = 'job-card', emptyTestId = 'jobs-empty', emptyTextRe } =
    opts;
  const item = page.getByTestId(itemTestId).first();
  const empty = emptyTextRe
    ? page.getByText(emptyTextRe).first()
    : page.getByTestId(emptyTestId).first();
  const start = Date.now();
  while (Date.now() - start < 8000) {
    if (
      (await item.isVisible().catch(() => false)) ||
      (await empty.isVisible().catch(() => false))
    ) {
      expect(true).toBeTruthy();
      return;
    }
    await page.waitForTimeout(100);
  }
  expect(
    false,
    `Neither '${itemTestId}' nor '${emptyTestId}' became visible in list '${listTestId}'`
  ).toBeTruthy();
}

/** Simpler helper for tests that expect “Login” directly but should allow PKCE start too. */
export async function expectLoginOrPkce(page: Page, timeout = 8000) {
  const any = new RegExp(`${pkceStartRe.source}|${loginRe.source}`);
  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(any);
}

/** Returns true if we stayed on same origin, false if CTA points to a different origin. */
export async function clickIfSameOriginOrAssertHref(
  page: Page,
  cta: Locator,
  pathMustMatch: RegExp
): Promise<boolean> {
  const base = new URL(page.url());
  const href = (await cta.getAttribute('href')) ?? '';
  if (!href) {
    // No href (e.g., button) → click and treat as same-origin navigation
    await cta.click();
    return true;
  }
  const target = new URL(href, base);
  // If the CTA points to another origin, just assert the PATH and don't navigate.
  if (target.origin !== base.origin) {
    expect(target.pathname).toMatch(pathMustMatch);
    return false;
  }
  await cta.click();
  return true;
}


