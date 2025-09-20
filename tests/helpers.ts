import { expect, type Page } from '@playwright/test';

export async function expectLoginOrPkce(page: Page) {
  await expect(page).toHaveURL(/\/login\?next=|\/api\/auth\/pkce\/start\?next=/);
}

export async function expectAuthAwareRedirect(page: Page, urlPattern: RegExp) {
  await page.waitForLoadState('networkidle');
  const current = page.url();
  expect(current).toMatch(urlPattern);
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
  await expect.poll(() => page.url()).toContain(next);
}
