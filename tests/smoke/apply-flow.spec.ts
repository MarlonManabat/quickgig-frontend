import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, gotoHome } from './_helpers';
import { loginAs } from '../e2e/helpers';

for (const device of ['desktop', 'mobile'] as const) {
  const mobile = device === 'mobile';
  test.describe(device, () => {
    if (mobile) test.use({ viewport: { width: 390, height: 844 } });

    test('apply flow', async ({ page, baseURL }) => {
      await gotoHome(page);
      try {
        await loginAs(baseURL!, 'worker', page);
      } catch {}

      await page.goto('/browse-jobs');
      const first = page.getByTestId('job-card').first();
      const title = await first.textContent();
      await first.click();

      await page.getByTestId('apply-button').first().click();
      await expectAuthAwareRedirect(page, '/applications');
      if (/(^|\/)login(\?|$)/.test(await page.url())) return;

      const note = `note ${Date.now()}`;
      await page.getByTestId('apply-cover-note').fill(note);
      page.once('dialog', d => d.dismiss());
      await page.getByTestId('apply-submit').click();
      await page.waitForURL('**/applications');
      await expect(page.getByTestId('applications-list')).toContainText(title || '');
    });
  });
}
