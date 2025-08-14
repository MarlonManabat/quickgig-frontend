// @ts-nocheck
import { test, expect } from '@playwright/test';
import fs from 'fs';

const ctaSelector = 'text=/Simulan Na!|Browse Jobs|Login|Sign Up/i';

 test('home page renders', async ({ page, request }) => {
  fs.mkdirSync('reports', { recursive: true });
  const redirect = await request.get('/', { maxRedirects: 0 });
  expect(redirect.status()).toBeGreaterThanOrEqual(301);
  expect(redirect.status()).toBeLessThan(309);
  expect(redirect.headers()['location']).toContain('app.quickgig.ph');

  const consoleErrors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  const assetErrors: {url:string,status:number}[] = [];
  page.on('response', r => {
    if (/\.(css|js)(\?|$)/.test(r.url()) && r.status() >= 400) {
      assetErrors.push({ url: r.url(), status: r.status() });
    }
  });

  await page.goto('/');
  expect(page.url()).toContain('app.quickgig.ph');
  await expect(page).toHaveTitle(/QuickGig/i);

  await expect(page.locator(ctaSelector).first()).toBeVisible();

  fs.writeFileSync('reports/console-errors.json', JSON.stringify([{ page: 'home', errors: consoleErrors }], null, 2));
  expect(consoleErrors).toEqual([]);
  expect(assetErrors).toEqual([]);
});
