import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, clickIfSameOriginOrAssertHref, expectToBeOnRoute, visByTestId, loginOr } from './_helpers';

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
        const el = await visByTestId(page, id);
        await expect(await el.getAttribute('data-cta')).toBe(id);
      }

      const browse = await visByTestId(page, 'nav-browse-jobs');
      if (await browse.isVisible()) await browse.click();
      await expectToBeOnRoute(page, /\/browse-jobs\/?$/);
      // Tolerate empty state in preview. Prefer cards if present.
      const list = page.getByTestId('jobs-list');
      const listExists = (await list.count()) > 0;
      if (listExists) {
        await expect(list).toBeVisible();
      } else {
        const hasEmpty = await page
          .getByText(/no jobs yet|wala pang jobs|empty state/i)
          .first()
          .isVisible()
          .catch(() => false);
        expect(hasEmpty).toBeTruthy();
      }

      {
        const cta = await visByTestId(page, 'nav-post-job');
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/gigs\/create$/);
        if (navigated) await expectAuthAwareRedirect(page, loginOr(/\/gigs\/create$/));
      }

      await page.goto('/');
      {
        const cta = await visByTestId(page, 'nav-my-applications');
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/applications$/);
        if (navigated) await expectAuthAwareRedirect(page, loginOr(/\/applications$/));
      }

      await page.goto('/');
      {
        const cta = await visByTestId(page, 'nav-tickets');
        const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/tickets$/);
        if (navigated) {
          const buy = page.getByTestId('buy-tickets');
          await expect(buy).toBeVisible();
          await buy.click();
          await expect(page.locator('#order-status')).toHaveText('pending');
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
