import { test, expect } from '@playwright/test';

test('@wip create guard (logged out) shows inline login', async ({ page }) => {
  // keep for later; excluded on PR
  await page.goto('/create');
  await expect(page.getByText('please log in')).toBeVisible();
  await expect(page).toHaveURL(/\/create$/);
});
