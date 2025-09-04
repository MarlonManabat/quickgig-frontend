import { test, expect } from '@playwright/test';

test.describe('Post Job form', () => {
  test('renders form or skeleton', async ({ page }) => {
    await page.goto('/gigs/create', { waitUntil: 'domcontentloaded' });
    const heading = page.getByRole('heading', { name: /post a job/i });
    const skeleton = page.getByTestId('post-job-skeleton');
    await expect(heading.or(skeleton)).toBeVisible({ timeout: 3000 });
    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.locator('text=Location')).toBeVisible();
  });
});
