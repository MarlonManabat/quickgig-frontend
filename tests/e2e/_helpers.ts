import { expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Go to the app root (expects middleware to redirect "/" → "/browse-jobs").
 */
export async function gotoHome(page: Page) {
  await page.goto(BASE_URL + '/');
}

/**
 * Open the mobile nav menu and wait until it is visible.
 * Supports either "nav-*" (desktop contract) or "navm-*" (mobile contract) ids.
 */
export async function openMenu(page: Page) {
  // Prefer canonical mobile menu ids; fall back to legacy names.
  const button = page.getByTestId('nav-menu-button').or(page.getByTestId('navm-menu-button'));
  const menu   = page.getByTestId('nav-menu').or(page.getByTestId('navm-menu'));

  await button.click();
  await expect(menu).toBeVisible({ timeout: 2_000 });
}

/**
 * Convert a destination (path string or anchored RegExp /^\/path(?:\/)?$/) into a canonical path string.
 * Avoids brittle regex surgery that caused "Invalid regular expression flag" parse errors.
 */
function toPath(dest: string | RegExp): string {
  if (typeof dest === 'string') return dest.startsWith('/') ? dest : `/${dest}`;
  // Strip leading "^" and optional "/" and any optional end anchor variants.
  const src = dest.source
    .replace(/^\^?\/?/, '')  // beginning
    .replace(/\|?\$$/, '');  // trailing "|?$" → ""
  return '/' + src;
}

/**
 * Assert that clicking an auth-gated CTA results in /login with ?next=<encoded path>.
 * Uses URL parsing instead of regex, eliminating syntax pitfalls.
 */
export async function expectAuthAwareRedirect(page: Page, dest: string | RegExp) {
  const path = toPath(dest);
  await expect(page).toHaveURL((url) => {
    try {
      const u = new URL(url);
      return u.pathname === '/login' && u.searchParams.get('next') === path;
    } catch {
      return false;
    }
  }, { timeout: 8_000 });
}

/**
 * Convenience: assert we land on a route (string or anchored RegExp).
 */
export async function expectToBeOnRoute(page: Page, dest: string | RegExp) {
  if (typeof dest === 'string') {
    await expect(page).toHaveURL(new RegExp(`${dest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\/)?$`), { timeout: 8_000 });
    return;
  }
  await expect(page).toHaveURL(dest, { timeout: 8_000 });
}
