import { expect, Page } from '@playwright/test';

/** Navigate to site root. */
export async function gotoHome(page: Page) {
  await page.goto('/');
}

/** Open the mobile hamburger menu if it exists & is visible; no-op on desktop. */
export async function openMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button');
  try {
    await btn.waitFor({ state: 'visible', timeout: 2000 });
    if (await btn.isVisible()) await btn.click();
  } catch {
    /* hidden on desktop – ignore */
  }
}

/** Escape a string for embedding in a RegExp. */
function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build a regex that matches `/login?next=<encoded dest>` for either a string or a RegExp destination.
 */
function makeLoginRe(dest: string | RegExp) {
  if (typeof dest === 'string') {
    return new RegExp(`/login\\?next=${escapeRe(encodeURIComponent(dest))}$`);
  }
  // Derive a stable literal-ish fragment from the regex, encode it, then allow it inside next=
  const literal = dest.source
    .replace(/^\^?/, '')
    .replace(/\$?\/?$/, '')
    .replace(/\\\//g, '/')
    .replace(/\(\?:.*?\)\??/g, '')
    .replace(/\.\*/g, '');
  const enc = encodeURIComponent(literal);
  return new RegExp(`/login\\?next=[^#]*${escapeRe(enc)}[^#]*$`);
}

/**
 * Wait until the page URL is either the login redirect for `dest` OR `dest` itself.
 * `dest` may be a literal path string (e.g. "/applications") or a RegExp (e.g. /\/gigs\/create\/?$/).
 */
export async function expectAuthAwareRedirect(page: Page, dest: string | RegExp, timeout = 8000) {
  const loginRe = makeLoginRe(dest);
  const destRe =
    typeof dest === 'string'
      ? new RegExp(`${escapeRe(dest).replace(/\\\//g, '\\/')}\\/?$`)
      : dest;

  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${loginRe.source}|${destRe.source}`));
}
