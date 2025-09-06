import { Page, expect } from '@playwright/test';

export async function expectAuthAwareRedirect(page: Page, path: `/${string}`) {
  const encoded = encodeURIComponent(path);
  const re = new RegExp(`/login\?next=${encoded}$`);
  await page.waitForURL(re, { timeout: 8000 });
}
