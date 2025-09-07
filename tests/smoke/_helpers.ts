import { expect, Page } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
}

export async function openMenu(page: Page) {
  // Mobile: open the hamburger before selecting header CTAs
  await page.getByTestId('nav-menu-button').click();
}

/**
 * Waits for either a login redirect with ?next=<path> OR landing directly on the dest.
 * Returns 'redirect' when /login?next=... wins, or 'visible' when destination wins.
 */
export async function expectAuthAwareRedirect(
  page: Page,
  path: string | RegExp,
  timeout = 8000
): Promise<'redirect' | 'visible'> {
  const destRe =
    typeof path === 'string'
      ? new RegExp(path.replace(/\//g, '\\/') + '\\/?$')
      : path;

  const encoded = typeof path === 'string' ? encodeURIComponent(path) : null;
  const loginRe = encoded ? new RegExp(`/login\\?next=${encoded}$`) : /\/login\?next=/;

  const winner = await Promise.race([
    page.waitForURL(loginRe, { timeout }).then(() => 'redirect' as const),
    page.waitForURL(destRe, { timeout }).then(() => 'visible' as const),
  ]);

  expect(winner).toBeTruthy();
  return winner;
}
