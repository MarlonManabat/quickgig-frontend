import { expect, Page, Locator } from '@playwright/test';

// Stub the PKCE start endpoint so unauthenticated flows don't crash the page.
export async function stubAuthPkce(page: Page) {
  // @ts-expect-error mark once on the page object
  if ((page as any).__pkceStubbed) return;
  await page.route('**/api/auth/pkce/start', async (route) => {
    try {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    } catch {
      await route.continue();
    }
  });
  // @ts-expect-error attach flag to avoid duplicate routes
  (page as any).__pkceStubbed = true;
}

export const mobileViewport = { viewport: { width: 390, height: 844 } };

// Ensure mobile drawer is open so nav items are visible
export async function openMobileMenu(page: Page) {
  const triggers = [
    '[data-testid="nav-menu-button"]',
    'button[aria-controls="nav-menu"]',
    'button[aria-label="Menu"]',
    'button:has-text("Menu")',
  ];
  for (const sel of triggers) {
    const btn = page.locator(sel);
    if (await btn.count()) {
      await btn.first().click();
      break;
    }
  }
  const menu = page.getByTestId('nav-menu');
  await expect(menu).toBeVisible();
  return menu;
}

export async function expectAuthAwareRedirect(page: Page, dest: RegExp, timeout = 8000) {
  await stubAuthPkce(page);
  await expect
    .poll(
      async () => {
        const u = page.url();
        if (u.startsWith('chrome-error://')) {
          throw new Error(
            `Auth redirect crashed: last URL ${u}. Stubbed /api/auth/pkce/start but page still crashed.`
          );
        }
        return u;
      },
      { timeout }
    )
    .toMatch(dest);
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
