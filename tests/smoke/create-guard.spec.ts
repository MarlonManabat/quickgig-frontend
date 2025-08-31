import { test, expect } from '@playwright/test';
import { hardenSmoke } from './_utils';

test('@wip create guard (logged out) shows inline login', async ({ page }) => {
  // keep for later; excluded on PR
  await hardenSmoke(page);
  await page.goto('/create');
  await expect(page.getByText('please log in')).toBeVisible();
  await expect(page).toHaveURL(/\/create$/);
});
