import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';
import { loginAs } from '../e2e/helpers';

for (const device of ['desktop', 'mobile'] as const) {
  const mobile = device === 'mobile';
  test.describe(device, () => {
    if (mobile) test.use({ viewport: { width: 390, height: 844 } });

    test('apply flow', async ({ page, baseURL }) => {
      let loggedIn = false;
      try {
        await loginAs(baseURL!, 'worker', page);
        loggedIn = true;
      } catch {}

      await page.goto('/browse-jobs');
      const count = await page.getByTestId('job-card').count();
      if (count === 0) test.skip(true, 'No seeded jobs in preview; skipping apply flow.');
      const first = page.getByTestId('job-card').first();
      const title = (await first.textContent()) ?? '';
      await first.click();

      if (!loggedIn) {
        await page.getByTestId('apply-button').click();
        await expectAuthAwareRedirect(page, /\/applications$/);
        return;
      }

      await page.getByTestId('apply-button').click();
      const note = `note ${Date.now()}`;
      await page.getByTestId('apply-cover-note').fill(note);
      page.once('dialog', d => d.dismiss());
      await page.getByTestId('apply-submit').click();
      await page.waitForURL('**/applications');
      await expect(page.getByTestId('applications-list')).toContainText(title || '');
    });
  });
}
