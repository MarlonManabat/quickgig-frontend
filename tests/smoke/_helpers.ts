import { Page } from '@playwright/test';

export async function expectAuthAwareRedirect(page: Page, dest: string|RegExp) {
  await page.waitForURL('**/login*', { timeout: 8000 }).catch(() => {});
  const path =
    typeof dest === 'string'
      ? dest.replace(/^\//, '').replace(/\/$/, '')
      : (dest as RegExp).source.replace(/^\/|\/$/g, '');
  const encoded = encodeURIComponent(`/${path}`);
  const re = new RegExp(`/login\?next=${encoded}`);
  await page.waitForURL(re, { timeout: 8000 });
}
