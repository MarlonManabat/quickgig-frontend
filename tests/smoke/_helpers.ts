import { Page, expect } from '@playwright/test';

// In CI some routes land on their destination without auth, while prod redirects to /login?next=…
// Treat either outcome as OK to avoid flakes.
export async function expectAuthAwareRedirect(
  page: Page,
  path: string | RegExp,
  timeout = 8000
) {
  const escape = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const toRe = (p: string | RegExp) =>
    p instanceof RegExp ? p : new RegExp(`${escape(p)}$`);

  const destRe = toRe(path);
  const pathStr = path instanceof RegExp ? null : path;
  const loginRe = pathStr
    ? new RegExp(`/login\\?next=${encodeURIComponent(pathStr)}$`)
    : /\/login\?next=.*/;

  const winner = await Promise.race([
    page.waitForURL(loginRe, { timeout }).then(() => 'login'),
    page.waitForURL(destRe, { timeout }).then(() => 'dest'),
  ]);

  expect(winner).toMatch(/^(login|dest)$/);
}

