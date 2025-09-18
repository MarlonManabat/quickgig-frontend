import { expect, Locator } from '@playwright/test';
import type { Page } from '@playwright/test';

export const loginRe = /\/login(?:\?.*)?$/;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const browseJobsRe = /\/browse-jobs(\?.*)?$/;
const EMPTY_TEST_IDS = ['jobs-empty', 'empty-state'];

export function hostAware(re: RegExp) {
  return new RegExp(`(?:https?:\\/\\/[^/]+)?${re.source}`);
}

export function loginOr(path: string | RegExp) {
  const rhs = typeof path === 'string' ? escapeRe(path) : path.source;
  return new RegExp(`${loginRe.source}|${rhs}`);
}

export async function expectToBeOnRoute(page: Page, path: string | RegExp, timeout = 8000) {
  const src = typeof path === 'string' ? escapeRe(path) : path.source;
  await expect(page).toHaveURL(hostAware(new RegExp(src)), { timeout });
}

export async function visByTestId(page: Page, id: string) {
  const loc = page.getByTestId(id).locator(':visible').first();
  await expect(loc).toBeVisible({ timeout: 12000 });
  return loc;
}

export async function expectAuthAwareRedirect(page: Page, re: RegExp, timeout = 12000) {
  await expect(page).toHaveURL(hostAware(re), { timeout });
}

export async function gotoHome(page: Page, baseURL?: string) {
  await page.goto(baseURL || '/');
  await expect(page).toHaveURL(new RegExp(`^.+(/|${browseJobsRe.source})$`));
}

/** Ensure mobile drawer is open so nav items are visible */
export async function openMobileMenu(page: Page) {
  const drawer =
    (page as any).getByTestId?.('nav-menu') ??
    page.locator('[data-testid="nav-menu"]');

  // Prefer explicit toggle if present
  const toggle =
    (page as any).getByTestId?.('nav-menu-button') ??
    page.locator('[data-testid="nav-menu-button"]');
  if (await toggle.first().isVisible().catch(() => false)) {
    await toggle.first().click();
    await expect(drawer).toBeVisible({ timeout: 4000 });
    return;
  }

  // Support <details data-testid="nav-menu">
  if (
    await drawer
      .first()
      .evaluate((el: any) => el.tagName === 'DETAILS' && !(el as HTMLDetailsElement).open)
      .catch(() => false)
  ) {
    await drawer.locator('summary').first().click();
    await expect(drawer).toHaveAttribute('open', '', { timeout: 4000 });
    return;
  }

  // Fallbacks across headers
  const candidates = [
    '[data-testid="nav-menu-button"]',
    '[data-test="nav-menu-button"]',
    'button[aria-label="Menu"]',
    'button:has-text("Menu")',
  ];
  for (const sel of candidates) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click();
      await expect(drawer).toBeVisible({ timeout: 4000 });
      return;
    }
  }
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
  const emptyTestIds = 'testId' in emptyMarker
    ? (EMPTY_TEST_IDS.includes(emptyMarker.testId)
        ? EMPTY_TEST_IDS
        : [emptyMarker.testId])
    : [];
  const emptyLocators =
    emptyTestIds.length > 0
      ? emptyTestIds.map((id) => page.getByTestId(id).first())
      : [page.getByText(emptyMarker.text as any, { exact: false }).first()];
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await list.isVisible().catch(() => false)) {
      expect(true).toBeTruthy();
      return;
    }
    for (const empty of emptyLocators) {
      if (await empty.isVisible().catch(() => false)) {
        expect(true).toBeTruthy();
        return;
      }
    }
    await page.waitForTimeout(100);
  }
  const message =
    emptyTestIds.length > 0
      ? `Neither list '${listTestId}' nor any empty-state (${emptyTestIds.join(', ')}) became visible`
      : `Neither list '${listTestId}' nor empty-state became visible`;
  expect(false, message).toBeTruthy();
}

/** Simpler helper for tests that expect “Login” directly but should allow PKCE start too. */
export async function expectLoginOrPkce(page: Page, timeout = 8000) {
  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(loginRe);
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


