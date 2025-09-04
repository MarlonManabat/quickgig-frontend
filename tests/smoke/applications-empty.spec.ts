import { test, expect } from '@playwright/test';

test('Applications page renders empty state when no applications', async ({ page }) => {
  await page.goto('/applications');
  await expect(page.getByTestId('applications-list')).toBeVisible();
  // Accept either an empty row count or explicit empty-state
  const rows = await page.getByTestId('application-row').count();
  if (rows === 0) {
    await expect(page.getByTestId('applications-empty')).toBeVisible();
  }
});
