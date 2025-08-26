import { Page, Locator, expect } from '@playwright/test';
import fs from 'fs/promises';

const selector = [
  'button:not([disabled])',
  '[role="button"]:not([aria-disabled="true"])',
  '[data-testid*="btn"]',
].join(',');

export async function collectButtons(page: Page): Promise<Locator[]> {
  const loc = page.locator(selector);
  const count = await loc.count();
  const res: Locator[] = [];
  for (let i = 0; i < count; i++) {
    const btn = loc.nth(i);
    if (await btn.isVisible()) res.push(btn);
  }
  return res;
}

export interface ButtonResult {
  name: string;
  ok: boolean;
}

export async function auditPage(page: Page, path: string) {
  const buttons = await collectButtons(page);
  const results: ButtonResult[] = [];
  for (const btn of buttons) {
    const name = (await btn.textContent())?.trim() || '<unnamed>';
    let ok = true;
    try {
      await expect(btn).toBeEnabled();
      await btn.click({ timeout: 5000 }).catch(() => {});
    } catch {
      ok = false;
    }
    results.push({ name, ok });
  }
  await fs.mkdir('button-audit', { recursive: true });
  const slug = path === '/' ? 'home' : path.replace(/\//g, '_').replace(/^_/, '');
  const file = `button-audit/${slug}.json`;
  await fs.writeFile(file, JSON.stringify(results, null, 2));
}
