import { expect, Page, Locator } from '@playwright/test';

const pkceStartRe = /\/api\/auth\/pkce\/start(\?.*)?$/;
export const loginRe = /\/login(\?.*)?$/;

export const mobileViewport = { viewport: { width: 390, height: 844 } };

// Ensure mobile drawer is open so nav items are visible
export async function openMobileMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button').first();
  await expect(
    btn,
    'mobile menu toggle should be visible at mobile widths'
  ).toBeVisible();
  await btn.click();
  await expect(page.getByTestId('nav-menu')).toBeVisible();
}

export async function expectAuthAwareRedirect(page: Page, dest: RegExp) {
  const expected = new RegExp(
    `${pkceStartRe.source}|${loginRe.source}|${dest.source}`
  );
  await expect
    .poll(async () => {
      const u = page.url();
      if (u.startsWith('chrome-error://')) {
        throw new Error(
          `Auth redirect crashed: last URL ${u}. Fix /api/auth/pkce/start or enable AUTH_PKCE_OPTIONAL.`
        );
      }
      return u;
    }, { timeout: 10000 })
    .toMatch(expected);
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
