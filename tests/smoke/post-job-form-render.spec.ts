import { test, expect } from '@playwright/test';
import { expectAuthAwareSuccess } from '../e2e/helpers';

test('Post Job form › renders form, skeleton, or redirects', async ({ page }) => {
  await page.goto('/gigs/create');

  const heading = page.getByRole('heading', { name: /post a job/i });
  const skeleton = page.getByTestId('post-job-skeleton');

  await Promise.race([
    heading.waitFor({ timeout: 10000 }),
    skeleton.waitFor({ timeout: 10000 }),
    expectAuthAwareSuccess(page, /\/gigs\/create\/?$/),
  ]);

  if (await heading.isVisible()) {
    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByLabel('Location')).toBeVisible();
  }
});
