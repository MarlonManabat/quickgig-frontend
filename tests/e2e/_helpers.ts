import { expect, Page } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
}

// Assert we either land on `dest` or are redirected to `/login?next=<dest>`.
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

// Convenience: assert we land on a route (string or anchored RegExp).
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

