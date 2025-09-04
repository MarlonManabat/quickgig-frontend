import { expect, Page } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
  await page.waitForURL(/\/browse-jobs\/?$/);
}

export async function openMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button');
  if (await btn.isVisible()) {
    await btn.click();
    await expect(page.getByTestId('nav-menu')).toBeVisible();
  }
}

export async function expectAuthAwareRedirect(page: Page, dest: RegExp | string) {
  const path =
    typeof dest === 'string'
      ? dest.replace(/^\/*/, '').replace(/\/?$/, '')
      : dest.source.replace(/^\/*/, '').replace(/\/?$/, '');
  const encoded = encodeURIComponent('/' + path);
  const loginNext = new RegExp(`/login\\?next=${encoded}`);

  try {
    await page.waitForURL(`**/${path}`, { timeout: 8000 });
  } catch {
    await page.waitForURL(loginNext, { timeout: 8000 });
  }
}

export async function expectToBeOnRoute(page: Page, dest: string | RegExp) {
  if (typeof dest === 'string') {
    await expect(page).toHaveURL(
      new RegExp(`${dest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:/)?$`),
      { timeout: 8000 },
    );
    return;
  }
  await expect(page).toHaveURL(dest, { timeout: 8000 });
}

