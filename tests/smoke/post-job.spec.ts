import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Post Job › auth-aware publish flow', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByTestId('nav-post-job').click();
  const dest = '/gigs' + '/create';
  const res = await expectAuthAwareRedirect(page, dest);

  if (res === 'login') {
    testInfo.annotations.push({ type: 'note', description: 'Redirected to login as expected in CI' });
    return;
  }

  await page.getByPlaceholder('Job title').fill(`Test Job ${Date.now()}`);
  await page.getByPlaceholder('Describe the work').fill('desc');
  await page.getByTestId('select-region').selectOption({ index: 1 });
  const options = await page.locator('[data-testid="select-city"] option').all();
  expect(options.length).toBeGreaterThan(1);
  await page.getByTestId('post-job-submit').click();
  await expect(page.getByTestId('post-job-success'), { timeout: 10000 }).toBeVisible();
});
