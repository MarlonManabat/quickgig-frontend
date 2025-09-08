import { expect, Page } from '@playwright/test';

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

