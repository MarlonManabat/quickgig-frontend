import { expect, Page, Locator } from '@playwright/test';

export const LOGIN_OR_PKCE = /^(?:\/api\/auth\/pkce\/start(?:\?.*)?$|\/login(?:\?.*)?$)/;

export const mobileViewport = { viewport: { width: 390, height: 844 } };

export async function openMobileMenu(page: Page) {
  // Always click the actual button; containers may be hidden.
  const btn = page.getByTestId('nav-menu-button');
  await btn.first().click();
  const drawer = page.getByTestId('nav-menu');
  await expect(drawer, 'nav drawer should be visible after toggle').toBeVisible();
  return drawer;
}

export async function expectHref(loc: Locator, re: RegExp) {
  const href = (await loc.getAttribute('href')) ?? '';
  expect(href, `href was '${href}'`).toMatch(re);
}

/**
 * Assert an auth-aware boundary **without** navigating:
 * - If already authorized, current URL should match `dest`.
 * - Otherwise, href on the last focused/active link/button should point to `/login?...` or `/api/auth/pkce/start?...`.
 * We avoid clicking + polling page.url() to stop chromewbdata crashes in CI.
 */
export async function expectAuthAwareRedirect(page: Page, dest: RegExp, timeout = 8000) {
  if (dest.test(page.url())) {
    expect(page.url()).toMatch(dest);
    return;
  }

  const candidate = page
    .locator(':focus, [data-cta], a[role="link"], a, button[role="link"]').first();
  await expect(candidate, 'expected a CTA to be focused/available').toBeVisible({ timeout });
  await expectHref(candidate, LOGIN_OR_PKCE);
}

export async function expectListOrEmpty(
  page: Page,
  listTestId: string,
  opts: {
    itemTestId?: string;
    emptyTestId?: string;
    emptyTextRe?: RegExp;
  }
) {
  const { itemTestId = 'job-card', emptyTestId = 'jobs-empty', emptyTextRe } =
    opts;
  const item = page.getByTestId(itemTestId).first();
  const empty = emptyTextRe
    ? page.getByText(emptyTextRe).first()
    : page.getByTestId(emptyTestId).first();
  const start = Date.now();
  while (Date.now() - start < 8000) {
    if (
      (await item.isVisible().catch(() => false)) ||
      (await empty.isVisible().catch(() => false))
    ) {
      expect(true).toBeTruthy();
      return;
    }
    await page.waitForTimeout(100);
  }
  expect(
    false,
    `Neither '${itemTestId}' nor '${emptyTestId}' became visible in list '${listTestId}'`
  ).toBeTruthy();
}

export async function expectLoginOrPkce(page: Page, timeout = 8000) {
  const any = new RegExp(`/api/auth/pkce/start|/login`);
  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(any);
}

export async function clickIfSameOriginOrAssertHref(
  page: Page,
  cta: Locator,
  pathMustMatch: RegExp
): Promise<boolean> {
  const base = new URL(page.url());
  const href = (await cta.getAttribute('href')) ?? '';
  if (!href) {
    await cta.click();
    return true;
  }
  const target = new URL(href, base);
  if (target.origin !== base.origin) {
    expect(target.pathname).toMatch(pathMustMatch);
    return false;
  }
  await cta.click();
  return true;
}
