import { expect, Locator, Page } from '@playwright/test';

export function reAuthAware(dest: string): RegExp {
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\]/g, '\$&');
  const enc = encodeURIComponent(dest);
  // Accept /login?next=<dest> OR <dest> (+ optional query/hash)
  return new RegExp(`^(\/login\?next=${enc}(?:$|[&#])|${esc(dest)}(?:$|[?#]))`);
}

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
  // Wait for our auth start *request* to fire.
  const pkceHit = await page
    .waitForRequest((r) => pkceStartRe.test(r.url()), { timeout })
    .then(() => true)
    .catch(() => false);

  // Try to match the final URL, but ignore if Chrome crashed to the special page.
  const crashed = page.url().startsWith('chrome-error://');
  if (!crashed) {
    // Give it another shot in case PKCE fired just before we awaited URL.
    await expect(page).toHaveURL(dest, { timeout });
  } else {
    expect(pkceHit).toBeTruthy();
  }
}

/** Ensure mobile drawer is open so nav items are visible */
export async function expectHref(loc: Locator, re: RegExp) {
  const href = await loc.getAttribute('href');
  expect(href, `href was ${href}`).toMatch(re);
}

/**
 * Assert that a link either points directly to `target` or is auth-guarded
 * as `/login?next=${encodeURIComponent(target)}`. Never navigates.
 */
export async function expectAuthAwareHref(
  loc: Locator,
  target: string
): Promise<void> {
  const href = await loc.getAttribute('href');
  expect(href, `href was ${href}`).toBeTruthy();
  const dec = decodeURIComponent(href!);
  expect(
    dec === target || dec === `/login?next=${target}`,
    `href was ${href}, expected ${target} or /login?next=${encodeURIComponent(target)}`
  ).toBeTruthy();
}

/** Open the mobile drawer and return its container */
export async function openMobileMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button').first();
  await btn.click();
  const menu = page.getByTestId('nav-menu').first();
  await expect(menu).toBeVisible();
  return menu;
}

/** Assert either a list exists or an empty-state is rendered */
export async function expectListOrEmpty(
  page: Page,
  listTestId: string,
  emptyMarker:
    | { testId: string }
    | { text: RegExp }
    | { text: string },
  timeout = 8000
) {
  const list = page.getByTestId(listTestId).first();
  const empty =
    'testId' in emptyMarker
      ? page.getByTestId(emptyMarker.testId).first()
      : page.getByText(emptyMarker.text as any, { exact: false }).first();
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if ((await list.isVisible().catch(() => false)) || (await empty.isVisible().catch(() => false))) {
      expect(true).toBeTruthy();
      return;
    }
    await page.waitForTimeout(100);
  }
  expect(false, `Neither list '${listTestId}' nor empty-state became visible`).toBeTruthy();
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


