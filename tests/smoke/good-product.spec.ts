import { test, expect } from '@playwright/test';
import {
  expectListOrEmpty,
  mobileViewport,
  openMobileMenu,
  expectHref,
  LOGIN_OR_PKCE,
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
      const isMobile = vp.name === 'mobile';
      let menu;
      if (isMobile) {
        menu = await openMobileMenu(page);
        for (const id of ['nav-browse-jobs', 'nav-post-job', 'nav-my-applications']) {
          await expect(menu.getByTestId(id)).toBeVisible();
        }
        await menu.getByTestId('nav-browse-jobs').click();
      } else {
        await expectHref(page.getByTestId('nav-post-job'), LOGIN_OR_PKCE);
        await page.getByTestId('nav-browse-jobs').click();
      }
      await expect(page).toHaveURL(/\/browse-jobs/);
      await expectListOrEmpty(page, 'jobs-list', {
        itemTestId: 'job-card',
        emptyTestId: 'jobs-empty',
      });

      const postScope = isMobile ? await openMobileMenu(page) : page;
      const post = postScope.getByTestId('nav-post-job').first();
      await expect(post).toBeVisible();
      await expectHref(post, LOGIN_OR_PKCE);

      const appsScope = postScope;
      const apps = appsScope.getByTestId('nav-my-applications').first();
      await expect(apps).toBeVisible();
      await expectHref(apps, LOGIN_OR_PKCE);

      const ticketScope = postScope;
      const tickets = ticketScope.getByTestId('nav-tickets').first();
      await expect(tickets).toBeVisible();
      await expectHref(tickets, /\/tickets(\/|\?|$)/);

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
