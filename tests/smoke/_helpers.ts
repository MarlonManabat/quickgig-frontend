import { expect, Page } from '@playwright/test';

export async function openMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button');
  await expect(btn).toBeVisible();
  await btn.click();
  const panel = page.getByTestId('nav-menu');
  try {
    await expect(panel).toBeAttached({ timeout: 4000 });
    await expect(panel).toBeVisible({ timeout: 4000 });
  } catch {
    await btn.click();
    await expect(panel).toBeAttached({ timeout: 4000 });
    await expect(panel).toBeVisible({ timeout: 4000 });
  }
}

export async function expectAuthAwareRedirect(page: Page, destRe: RegExp) {
  try {
    await page.waitForURL(destRe, { timeout: 8000 });
  } catch {
    const escaped = destRe.source.replace(/^\/|\/[a-z]*$/g, '');
    const nextRe = new RegExp(`/login\\?next=${escaped.replaceAll('/', '\\/')}`);
    await page.waitForURL(nextRe, { timeout: 8000 });
  }
}
