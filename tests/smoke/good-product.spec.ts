import { test, expect } from '@playwright/test';
import { openMobileMenu, expectAuthAwareHref } from './_helpers';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('good product smoke', async ({ page }) => {
      await page.goto('/');

      if (vp.name === 'mobile') {
        const menu = await openMobileMenu(page);
        await expect(menu.locator('[data-cta="nav-browse-jobs"]').first()).toBeVisible();
        await expect(menu.locator('[data-cta="nav-browse-jobs"]')).toHaveAttribute('href', '/browse-jobs');
        await expectAuthAwareHref(menu.locator('[data-cta="nav-tickets"]'), '/tickets');
        await expectAuthAwareHref(menu.locator('[data-cta="nav-post-job"]'), '/post-jobs');
        await expectAuthAwareHref(menu.locator('[data-cta="nav-my-applications"]'), '/applications');
        await expect(menu.locator('[data-cta="nav-login"]')).toHaveAttribute('href', '/login');
      } else {
        await expect(page.getByTestId('nav-browse-jobs')).toHaveAttribute('href', '/browse-jobs');
        await expectAuthAwareHref(page.getByTestId('nav-tickets'), '/tickets');
        await expectAuthAwareHref(page.getByTestId('nav-post-job'), '/post-jobs');
        await expectAuthAwareHref(page.getByTestId('nav-my-applications'), '/applications');
        await expect(page.getByTestId('nav-login')).toHaveAttribute('href', '/login');
      }

      await page.goto('/browse-jobs');
      await expect(page).toHaveURL(/\/browse-jobs/);
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

      await page.goto('/tickets');
      const buy = page.getByTestId('buy-tickets');
      await expect(buy).toBeVisible();
      await buy.click();
      await expect(page.locator('#order-status')).toHaveText('pending');

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
