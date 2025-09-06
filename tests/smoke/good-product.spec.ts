import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('good product smoke', async ({ page }) => {
      await gotoHome(page);

      const ctas: Record<string, string> = {
        'nav-browse-jobs': '/browse-jobs',
        'nav-post-job': '/post-job',
        'nav-my-applications': '/applications',
        'nav-tickets': '/tickets',
      };
      for (const [id, href] of Object.entries(ctas)) {
        const el = page.getByTestId(id).first();
        await expect(el).toHaveAttribute('href', href);
        await expect(el).toHaveAttribute('data-cta', id);
      }

      await page.getByTestId('nav-browse-jobs').first().click();
      await expect(page).toHaveURL(/\/browse-jobs/);
      await expect(page.getByTestId('jobs-list')).toBeVisible();
      await expect(page.getByTestId('job-card').first()).toBeVisible();

      await page.getByTestId('nav-post-job').first().click();
      await expectAuthAwareRedirect(page, '/post-job');

      await gotoHome(page);
      await page.getByTestId('nav-my-applications').first().click();
      await expectAuthAwareRedirect(page, '/applications');

      await gotoHome(page);
      await page.getByTestId('nav-tickets').first().click();
      const buy = page.getByTestId('buy-tickets').first();
      await expect(buy).toBeVisible();
      await buy.click();
      await expect(page.locator('#order-status')).toHaveText('pending');

      const sitemap = await page.request.get('/sitemap.xml');
      expect(sitemap.ok()).toBeTruthy();
      const sitemapText = await sitemap.text();
      expect(sitemapText).toContain('/browse-jobs');

      const robots = await page.request.get('/robots.txt');
      expect(robots.ok()).toBeTruthy();
      const robotsText = await robots.text();
      expect(robotsText).toContain('Sitemap:');
    });
  });
}
