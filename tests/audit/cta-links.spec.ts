import { test, expect } from '@playwright/test';
import { expectHref, expectAuthAwareHref, rePath } from '../smoke/_helpers';

export const NAV = [
  { id: 'nav-browse-jobs', dest: '/browse-jobs', gated: false },
  { id: 'nav-post-job',    dest: '/post-jobs',    gated: true  },
  { id: 'nav-my-applications', dest: '/applications', gated: true },
  { id: 'nav-tickets',     dest: '/tickets',     gated: true  },
  { id: 'nav-login',       dest: '/login',       gated: false },
] as const;

async function openMobileMenuIfHidden(page: any) {
  const btn = page.getByTestId('nav-menu-button');
  if (await btn.count()) {
    const anyNav = page.getByTestId('nav-browse-jobs');
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

    for (const cta of NAV) {
      test(`${cta.id} routes to ${cta.gated ? 'dest or /login?next' : 'dest'}`, async ({ page }) => {
        const el = page.getByTestId(cta.id).first();
        await expect(el).toBeVisible();
        if (cta.gated) {
          await expectAuthAwareHref(page, cta.id, cta.dest);
        } else {
          await expectHref(el, rePath(cta.dest));
        }
      });
    }
  });
}
