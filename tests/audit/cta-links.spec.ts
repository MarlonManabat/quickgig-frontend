import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from '../smoke/_helpers';

const CTAS = [
  { id: 'nav-browse-jobs-header', dest: '/browse-jobs', gated: false },
  { id: 'nav-post-job-header', dest: /\/gigs\/create\/?$/i, gated: true },
  { id: 'nav-my-applications-header', dest: '/applications', gated: true },
  { id: 'nav-tickets-header', dest: '/tickets', gated: true },
  { id: 'nav-login-header', dest: '/login', gated: false },
  { id: 'hero-start', dest: '/browse-jobs', gated: false },
  { id: 'hero-post-job', dest: /\/gigs\/create\/?$/i, gated: true },
  { id: 'hero-applications', dest: '/applications', gated: true },
] as const;

async function openMobileMenuIfHidden(page: any) {
  const btn = page.getByTestId('nav-menu-button');
  if (await btn.count()) {
    const anyNav = page.getByTestId('nav-browse-jobs-header');
    if (!(await anyNav.isVisible().catch(() => false))) {
      await btn.click();
      await page.waitForTimeout(200);
    }
  }
}

for (const vp of [{ w: 1280, h: 800 }, { w: 390, h: 844 }]) {
  test.describe(`CTA audit @ ${vp.w}x${vp.h}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto('/');
      await openMobileMenuIfHidden(page);
    });

    for (const cta of CTAS) {
      const id = vp.w === 1280 && cta.id.endsWith('-header')
        ? cta.id
        : cta.id.replace('-header', '-menu');
      test(`${id} routes to ${cta.gated ? 'dest or /login?next' : 'dest'}`, async ({ page }) => {
        const el = page.getByTestId(id).first();
        await expect(el).toBeVisible();
        await Promise.all([page.waitForLoadState('domcontentloaded'), el.click()]);
        if (cta.gated) {
          await expectAuthAwareRedirect(page, cta.dest);
        } else {
          const destRe = typeof cta.dest === 'string'
            ? new RegExp(`${cta.dest.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}$`)
            : cta.dest;
          await expect.poll(async () => page.url()).toMatch(destRe);
        }
      });
    }
  });
}
