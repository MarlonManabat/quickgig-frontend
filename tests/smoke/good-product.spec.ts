import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

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
      await expect(page.getByTestId('jobs-list')).toBeVisible();
      await expect(page.getByTestId('job-card').first()).toBeVisible();

      await page.getByTestId('nav-post-job').first().click();
      await expectAuthAwareRedirect(page, '/post-job');

      await page.goto('/');
      await page.getByTestId('nav-my-applications').first().click();
      await expectAuthAwareRedirect(page, '/applications');

      await page.goto('/');
      await page.getByTestId('nav-tickets').first().click();
      const buy = page.getByTestId('buy-tickets');
      await expect(buy).toBeVisible();
      await buy.click();
      await expect(page.locator('#order-status')).toHaveText('pending');

      const sm = await page.request.get('/sitemap.xml');
      await expect(sm.ok()).toBeTruthy();
      const text = await sm.text();
      // Accept either explicit /browse-jobs entry or just a valid urlset/root entries.
      expect(text).toMatch(/<urlset|\/browse-jobs/);

      const robots = await page.request.get('/robots.txt');
      await expect(robots.ok()).toBeTruthy();
    });
  });
}
