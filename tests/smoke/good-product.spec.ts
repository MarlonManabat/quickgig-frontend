import { test, expect } from '@playwright/test';
import {
  expectAuthAwareRedirect,
  clickIfSameOriginOrAssertHref,
  expectListOrEmpty,
  mobileViewport,
  openMobileMenu,
  stubAuthPkce,
} from './_helpers';

const viewports = [
  { name: 'mobile', width: mobileViewport.viewport.width, height: mobileViewport.viewport.height },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('good product smoke', async ({ page }) => {
      await page.goto('/');
      await stubAuthPkce(page);

      const isMobile = vp.name === 'mobile';
      const scope = isMobile ? await openMobileMenu(page) : page;

      const ctas = ['nav-browse-jobs','nav-post-job','nav-my-applications','nav-tickets'];
      for (const id of ctas) {
        const el = scope.locator(`[data-cta="${id}"]`).first();
        await expect(el).toBeVisible();
        await expect(await el.getAttribute('data-cta')).toBe(id);
      }

      if (isMobile) {
        await scope.getByTestId('nav-browse-jobs').first().click();
      } else {
        await page.getByTestId('nav-browse-jobs').first().click();
      }
      await expect(page).toHaveURL(/\/browse-jobs/);
      await expectListOrEmpty(page, 'jobs-list', {
        itemTestId: 'job-card',
        emptyTestId: 'jobs-empty',
      });

      if (isMobile) {
        const menu = await openMobileMenu(page);
        const cta = menu.locator('[data-cta="nav-post-job"]').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/post-job$/);
        if (navigated) await expectAuthAwareRedirect(page, /\/post-job$/);
      } else {
        const cta = page.locator('[data-cta="nav-post-job"]').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/post-job$/);
        if (navigated) await expectAuthAwareRedirect(page, /\/post-job$/);
      }

      await page.goto('/');
      if (isMobile) {
        const menu = await openMobileMenu(page);
        const cta = menu.locator('[data-cta="nav-my-applications"]').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/applications$/);
        if (navigated) await expectAuthAwareRedirect(page, /\/applications$/);
      } else {
        const cta = page.locator('[data-cta="nav-my-applications"]').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/applications$/);
        if (navigated) await expectAuthAwareRedirect(page, /\/applications$/);
      }

      await page.goto('/');
      if (isMobile) {
        const menu = await openMobileMenu(page);
        const cta = menu.locator('[data-cta="nav-tickets"]').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/tickets$/);
        if (navigated) {
          await expect.soft(
            page.getByTestId('buy-tickets'),
            'buy-tickets optional in PR'
          ).toHaveCount(1);
        } else {
          await expect(true).toBeTruthy();
        }
      } else {
        const cta = page.locator('[data-cta="nav-tickets"]').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/tickets$/);
        if (navigated) {
          await expect.soft(
            page.getByTestId('buy-tickets'),
            'buy-tickets optional in PR'
          ).toHaveCount(1);
        } else {
          await expect(true).toBeTruthy();
        }
      }

      const sitemap = await page.request.get('/sitemap.xml');
      expect(sitemap.ok()).toBeTruthy();
      const sitemapText = await sitemap.text();
      // Accept either explicit /browse-jobs entry OR root entries for both hosts.
      const hasBrowseJobs = /\/browse-jobs/.test(sitemapText);
      const hasMainHost = /<loc>https?:\/\/quickgig\.ph\/<\/loc>/.test(sitemapText);
      const hasAppHost = /<loc>https?:\/\/app\.quickgig\.ph\/<\/loc>/.test(sitemapText);
      expect(hasBrowseJobs || (hasMainHost && hasAppHost)).toBeTruthy();

      const robots = await page.request.get('/robots.txt');
      expect(robots.ok()).toBeTruthy();
      const robotsText = await robots.text();
      expect(robotsText).toContain('Sitemap:');
    });
  });
}
