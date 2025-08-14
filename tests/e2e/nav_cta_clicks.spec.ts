// @ts-nocheck
import { test, expect, Browser } from '@playwright/test';
import fs from 'fs';

async function checkLink(browser: Browser, href: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  let error;
  page.on('pageerror', e => { error = e; });
  const res = await page.goto(href);
  await context.close();
  return { status: res ? res.status() : 0, error };
}

test('nav links and CTAs', async ({ page, browser }) => {
  fs.mkdirSync('reports', { recursive: true });
  await page.goto('https://app.quickgig.ph');
  const selector = 'header a, nav a, a[role="button"], button, .btn, .hero a';
  const handles = await page.locator(selector).filter({ has: page.locator(':visible') }).elementHandles();
  const links: { label: string; href: string }[] = [];
  for (const h of handles) {
    const href = await h.getAttribute('href');
    if (!href) continue;
    const label = (await h.innerText()).trim() || href;
    if (!links.find(l => l.href === href)) links.push({ label, href });
  }
  interface LinkResult { label: string; href: string; status: number | string }
  const results: LinkResult[] = [];
  for (const l of links) {
    if (/^mailto:|^tel:|^https?:\/\/(?!app\.quickgig\.ph)/.test(l.href)) {
      results.push({ ...l, status: 'skipped' });
      continue;
    }
    const url = l.href.startsWith('http') ? l.href : `https://app.quickgig.ph${l.href}`;
    const { status, error } = await checkLink(browser, url);
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
    expect(error).toBeFalsy();
    results.push({ ...l, href: url, status });
  }
  console.table(results);
  fs.writeFileSync('reports/cta-links.json', JSON.stringify(results, null, 2));
});
