import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect } from './_helpers';

test('Post Job > auth-aware publish flow', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-post-job').click();
  await expectAuthAwareRedirect(page, /\/gigs\/create\/?$/);
  const onCreate = /\/gigs\/create\/?$/.test(await page.url());
  if (!onCreate) return;

  await expect(page.getByTestId('post-job-submit')).toBeVisible({ timeout: 10000 });
});
