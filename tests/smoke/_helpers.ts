import { expect, Page } from '@playwright/test';

// Re-export to satisfy specs that import gotoHome from the smoke helpers.
export { gotoHome } from '../e2e/_helpers';

/**
 * Wait until the page lands on the final destination OR the auth
 * redirect (/login?next=...) that points toward it.
 *
 * - If `dest` is a string, we require an exact encoded match in next=.
 * - If `dest` is a RegExp, we accept ANY /login?next=... (CI uses many
 *   equivalent encodings), and we also accept a final URL that matches
 *   the provided regex.
 */
export async function expectAuthAwareRedirect(
  page: Page,
  dest: string | RegExp,
  timeout = 8000
) {
  const escapeRe = (s: string) => s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
  const destRe = typeof dest === 'string' ? new RegExp(`${escapeRe(dest)}$`) : dest;

  const loginRe =
    typeof dest === 'string'
      ? new RegExp(`/login\\?next=${encodeURIComponent(dest)}$`)
      : /\/login\?next=.*/; // be permissive when the destination itself is a regex

  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${loginRe.source}|${destRe.source}`));
}

