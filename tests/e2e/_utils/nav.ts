import type { Page } from '@playwright/test';
export async function goto(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}
