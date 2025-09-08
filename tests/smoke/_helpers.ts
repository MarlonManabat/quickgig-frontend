import { expect, Locator, Page } from '@playwright/test';

export async function openMobileMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button');
  if (await btn.isVisible()) {
    await btn.click();
  } else {
    const candidates = [
      '[data-testid="nav-menu-button"]',
      'button[aria-label="Menu"]',
      'button:has-text("Menu")',
    ];
    for (const sel of candidates) {
      const el = page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        break;
      }
    }
  }
  await expect(page.getByTestId('nav-menu')).toBeVisible();
}

export async function expectAuthAwareRedirect(page: Page, dest: RegExp) {
  const loginRe = /\/login(\?.*)?$/;
  const pkceRe = /\/api\/auth\/pkce\/start\?.*next=/;
  const chromeErr = /^chrome-error:\/\//;

  const outcome = await expect
    .poll(async () => {
      const u = page.url();
      if (chromeErr.test(u)) return 'chrome-error';
      if (dest.test(u)) return 'dest';
      if (loginRe.test(u)) return 'login';
      if (pkceRe.test(u)) return 'pkce';
      return 'pending';
    }, { timeout: 8_000 })
    .not.toBe('pending');

  expect(
    outcome,
    `Expected auth-aware redirect to '${dest}', last URL was '${page.url()}'`
  ).not.toBe('chrome-error');
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
