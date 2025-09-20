import { expect, type Page } from '@playwright/test';

const LOGIN_RE = /\/login\?next=/;
const PKCE_RE = /\/api\/auth\/pkce\/start\?next=/;

export async function expectAuthAwareRedirect(page: Page, destRe: RegExp) {
  await page.waitForLoadState('networkidle');
  const url = page.url();
  const ok = PKCE_RE.test(url) || LOGIN_RE.test(url) || destRe.test(url);
  expect(ok, `Expected auth-aware redirect or destination matching ${destRe}, but got ${url}`).toBeTruthy();
}

export async function expectLoginOrPkce(page: Page) {
  await page.waitForLoadState('networkidle');
  const url = page.url();
  const ok = PKCE_RE.test(url) || LOGIN_RE.test(url);
  expect(ok, `Expected /login?next=… or /api/auth/pkce/start?next=…, but got ${url}`).toBeTruthy();
}

export async function openMobileMenu(page: Page) {
  const menuButton = page.locator('[data-testid="nav-menu-button"]');
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(page.locator('[data-testid="nav-menu"]')).toBeVisible();
  }
}

export async function loginAs(page: Page, role: 'worker' | 'employer', next = '/browse-jobs') {
  await page.goto(`/api/auth/demo?role=${role}&next=${encodeURIComponent(next)}`);
  await page.waitForLoadState('networkidle');
  await page.waitForURL((url) => url.pathname === next || url.href.includes(next));
}
