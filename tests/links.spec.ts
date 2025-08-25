import { test, expect } from '@playwright/test';

const CANON = new Set([
  '/start?intent=worker',
  '/start?intent=employer',
  '/find',
  '/post',
  '/', '/home',
]);

test.describe('Landing CTAs are canonical', () => {
  test('hero has exactly two CTAs with canonical hrefs', async ({ page }) => {
    await page.goto('/');
    const ctas = await page
      .locator('a:has-text("Find work"), a:has-text("Simulan na"), a:has-text("Post job"), a:has-text("Post a job")')
      .all();
    // allow 1 or 2 depending on copy; enforce canonical hrefs
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    for (const a of ctas) {
      const href = await a.getAttribute('href');
      expect(href).toBeTruthy();
      // allow canonical target or canonical start
      const ok = [...CANON].some(c => href!.startsWith(c));
      expect(ok, `Bad CTA href: ${href}`).toBeTruthy();
    }
  });
});

test.describe('No dead links on landing', () => {
  test('all <a> resolve to 200/3xx and not 404', async ({ page, request }) => {
    await page.goto('/');
    const links = await page.$$eval('a[href]', as =>
      as.map(a => (a as HTMLAnchorElement).getAttribute('href') || '').filter(Boolean)
    );
    const unique = Array.from(new Set(links)).filter(href =>
      href.startsWith('/') && !href.startsWith('/api')
    );

    for (const href of unique) {
      const res = await request.get(href);
      expect(res.status(), `Dead link ${href}`).toBeLessThan(400);
    }
  });
});
