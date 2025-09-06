import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Post Job › auth-aware publish flow', async ({ page }) => {
  await page.goto('/post-job');

  if (page.url().includes('/login')) {
    await expectAuthAwareRedirect(page, '/post-job');
    return;
  }

  const title = `Test Job ${Date.now()}`;
  await page.getByPlaceholder('Job title').fill(title);
  await page.getByPlaceholder('Describe the work').fill('desc');
  await page.getByTestId('select-region').selectOption({ index: 1 });
  const options = await page.locator('[data-testid="select-city"] option').all();
  expect(options.length).toBeGreaterThan(1);
  await page.getByTestId('select-city').selectOption({ index: 1 });
  await page.getByTestId('post-job-submit').click();
  await page.getByTestId('post-job-success', { timeout: 10000 });
  await page.goto('/browse-jobs');
  await expect(page.getByTestId('jobs-list')).toContainText(title);
});
