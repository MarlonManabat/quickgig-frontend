import { test, expect } from '@playwright/test';

test.describe('Applications page (smoke)', () => {
  test('renders without crashing and shows a heading or empty-state', async ({ page }) => {
    await page.goto('/applications', { waitUntil: 'networkidle' });

    // No Next error overlay
    await expect(page.locator('text=This page could not be found')).toHaveCount(0);
    await expect(page.locator('text=Application error')).toHaveCount(0);

    // Either heading, list, or empty-state should appear
    const heading = page.getByRole('heading', { name: /Applications/i });
    const empty = page.locator('text=/No applications yet\.?/i');
    const listItems = page.locator('[data-testid="application-item"]');

    await expect.soft(heading).toHaveCountGreaterThan(0);
    await expect.soft(empty.or(listItems.first())).toBeVisible();
  });
});
