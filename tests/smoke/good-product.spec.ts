import { test, expect } from '@playwright/test';
import {
  expectAuthAwareRedirect,
  clickIfSameOriginOrAssertHref,
  expectListOrEmpty,
} from './_helpers';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('good product smoke', async ({ page }) => {
      await page.goto('/');

      const ctas = ['nav-browse-jobs','nav-post-job','nav-my-applications','nav-tickets'];
      for (const id of ctas) {
        const el = page.getByTestId(id).first();
        await expect(el).toBeVisible();
        await expect(await el.getAttribute('data-cta')).toBe(id);
      }

      await page.getByTestId('nav-browse-jobs').first().click();
      await expect(page).toHaveURL(/\/browse-jobs/);
      await expectListOrEmpty(page, 'jobs-list', {
        itemTestId: 'job-card',
        emptyTestId: 'jobs-empty',
      });

      {
        const cta = page.getByTestId('nav-post-job').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/post-job$/);
        if (navigated) await expectAuthAwareRedirect(page, /\/post-job$/);
      }

      await page.goto('/');
      {
        const cta = page.getByTestId('nav-my-applications').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/applications$/);
        if (navigated) await expectAuthAwareRedirect(page, /\/applications$/);
      }

      await page.goto('/');
      {
        const cta = page.getByTestId('nav-tickets').first();
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/tickets$/);
        if (navigated) {
          const buy = page.getByTestId('buy-tickets');
          await expect(buy).toBeVisible();
          await buy.click();
          await expect(page.locator('#order-status')).toHaveText('pending');
        } else {
          // If cross-origin, we just assert href path above; no further action
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
