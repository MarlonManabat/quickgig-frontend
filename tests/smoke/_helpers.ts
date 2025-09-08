import { expect, Page, Locator } from '@playwright/test';

// Accept both our login page and the PKCE start endpoint (with or without query)
const loginRe = /\/login(\?.*)?$/;
const pkceStartRe = /\/api\/auth\/pkce\/start(\?.*)?$/;

/** Expect we're redirected to auth (login or pkce start), OR we landed on the desired route if already authed. */
export async function expectAuthAwareRedirect(page: Page, dest: RegExp, timeout = 8_000) {
  const any = new RegExp(`${pkceStartRe.source}|${loginRe.source}|${dest.source}`);
  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(any);
}

/** Simpler helper for tests that expect “Login” directly but should allow PKCE start too. */
export async function expectLoginOrPkce(page: Page, timeout = 8_000) {
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

export { loginRe, pkceStartRe };

