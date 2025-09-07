import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, openMobileMenu } from './_helpers';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(vp.name, () => {
    const mobile = vp.name === 'mobile';
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('good product smoke', async ({ page }) => {
      await page.goto('/');
      if (mobile) {
        await openMobileMenu(page);
      }

      const ctas = ['nav-browse-jobs', 'nav-post-job', 'nav-my-applications', 'nav-tickets'];
      for (const id of ctas) {
        const el = page.getByTestId(id).first();
        await expect(el).toBeVisible();
        await expect(await el.getAttribute('data-cta')).toBe(id);
      }

      await page.getByTestId('nav-browse-jobs').first().click();
      await expect(page).toHaveURL(/\/browse-jobs\/?$/);
      await expect(page.getByTestId('jobs-list')).toBeVisible();
      await expect(page.getByTestId('job-card').first()).toBeVisible();

      await page.goto('/');
      if (mobile) await openMobileMenu(page);
      await page.getByTestId('nav-post-job').first().click();
      await expectAuthAwareRedirect(page, '/post-job');

      await page.goto('/');
      if (mobile) await openMobileMenu(page);
      await page.getByTestId('nav-my-applications').first().click();
      await expectAuthAwareRedirect(page, '/applications');

      await page.goto('/');
      if (mobile) await openMobileMenu(page);
      await page.getByTestId('nav-tickets').first().click();
      const buy = page.getByTestId('buy-tickets');
      await expect(buy).toBeVisible();
      await buy.click();
      await expect(page.locator('#order-status')).toHaveText('pending');

      const sitemap = await page.request.get('/sitemap.xml');
      expect(sitemap.ok()).toBeTruthy();
      const text = await sitemap.text();
      expect(
        text.includes('/browse-jobs') ||
          (text.includes('<loc>https://quickgig.ph/') &&
            text.includes('<loc>https://app.quickgig.ph/'))
      ).toBeTruthy();

      const robots = await page.request.get('/robots.txt');
      expect(robots.ok()).toBeTruthy();
      const robotsText = await robots.text();
      expect(robotsText).toContain('Sitemap:');
    });
  });
}
