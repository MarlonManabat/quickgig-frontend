import fs from 'fs';
import { waitForAppReady } from './helpers/waits';

export const routes = [
  '/',
  '/jobs',
  '/post',
  '/applications',
  '/messages',
  '/offers',
  '/billing',
  '/profile',
  '/login',
];

export async function discoverRoutes(page) {
  const set = new Set(routes);
  await page.goto('/');
  await waitForAppReady(page);
  const hrefs = await page
    .locator('header a[href^="/"], nav a[href^="/"], main a[href^="/"]')
    .evaluateAll((els) => els.map(e => (e as HTMLAnchorElement).getAttribute('href')));
  for (const href of hrefs) {
    if (!href) continue;
    try {
      const url = new URL(href, page.url());
      if (url.origin === new URL(page.url()).origin) {
        set.add(url.pathname);
      }
    } catch {}
  }
  return Array.from(set).slice(0, 50);
}

export const coverage = {} as Record<string, number>;
export function recordVisit(path: string) {
  coverage[path] = (coverage[path] || 0) + 1;
}
export function writeCoverage() {
  fs.writeFileSync('tests/qa/coverage.json', JSON.stringify(coverage, null, 2));
}
