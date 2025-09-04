import { expect, Page } from '@playwright/test';

export async function expectAuthAwareRedirect(page: Page, dest: RegExp) {
  // Accept either landing on dest, or being redirected to /login?next=<dest>
  try {
    await page.waitForURL(dest, { timeout: 8000 });
  } catch {
    const next = new RegExp('/login\\?next=' + encodeURIComponent(dest.source.replace(/^\\//, '')));
    await page.waitForURL(next, { timeout: 8000 });
  }
}
