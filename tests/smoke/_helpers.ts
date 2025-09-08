import { expect, Page, Locator } from '@playwright/test';

const LOGIN_WITH_NEXT = /^\/login(?:\?.*)?$/;

export function loginOr(dest: RegExp): RegExp {
  // match dest OR /login?next=...
  return new RegExp(`(?:${dest.source})|(?:${LOGIN_WITH_NEXT.source})`);
}

export async function stubAuthPkce(page: Page) {
  await page.route('**/api/auth/pkce/start**', async (route) => {
    const u = new URL(route.request().url());
    const next = u.searchParams.get('next') || '';
    const location = next ? `/login?next=${encodeURIComponent(next)}` : '/login';
    await route.fulfill({
      status: 302,
      headers: { location },
      contentType: 'text/plain',
      body: 'redirect',
    });
  });
}

export const mobileViewport = { viewport: { width: 390, height: 844 } };

export async function openMobileMenu(page: Page) {
  const toggle = page.getByTestId('nav-menu-button').first();
  await expect(toggle, 'mobile menu toggle should be visible').toBeVisible();
  await toggle.click();
  const drawer = page.getByTestId('nav-menu').first();
  await expect(drawer, 'mobile drawer should become visible').toBeVisible();
  return drawer;
}

export async function expectHref(loc: Locator, re: RegExp) {
  const href = await loc.getAttribute('href');
  expect(href, `href was ${href}`).toMatch(re);
}

export async function expectAuthAwareRedirect(page: Page, dest: RegExp, timeout = 8000) {
  await stubAuthPkce(page);
  await expect.poll(async () => page.url(), { timeout }).toMatch(dest);
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
