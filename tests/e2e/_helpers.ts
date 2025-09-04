import { expect, Page } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
}

/**
 * Assert that unauth navigation tries to land on `dest` by redirecting to
 * `/login?next=<encoded>`. Accepts `dest` as string or RegExp.
 * Avoids manual `/.../flags` construction that caused syntax errors.
 */
export async function expectAuthAwareRedirect(page: Page, dest: string | RegExp) {
  const path = typeof dest === 'string' ? dest : dest.source.replace(/^\^/, '').replace(/\$$/, '');
  const encoded = encodeURIComponent(path);
  const loginNext = new RegExp(String.raw`/login\?next=${encoded}`);
  await page.waitForURL(loginNext, { timeout: 8_000 });
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
