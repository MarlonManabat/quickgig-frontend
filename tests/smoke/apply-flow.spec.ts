import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from '../e2e/_helpers';

test('Open job → Apply is auth-aware', async ({ page }) => {
  await page.goto('/browse-jobs');
  const first = page.getByTestId('job-card').first();
  await first.click(); // title/link routes to detail
  await expect(page.getByTestId('apply-button')).toBeVisible();
  await page.getByTestId('apply-button').click();
  await expectAuthAwareRedirect(page, /\/applications\/?/);
});
