import { test, expect } from '@playwright/test';
import { goto } from './_utils/nav';

test('Home → Browse Jobs renders', async ({ page }) => {
  await goto(page, '/');
  await page.getByRole('link', { name: /browse jobs/i }).click();
  await expect(page).toHaveURL(/\/browse-jobs/);
  // assert shell, not data (DB can be empty)
  await expect(page.getByRole('heading', { name: /browse jobs/i })).toBeVisible();
  await expect(page.getByText(/no jobs yet/i).or(page.locator('li').first())).toBeVisible();
});

test('Home → My Applications renders (signed out ok)', async ({ page }) => {
  await goto(page, '/');
  await page.getByRole('link', { name: /my applications/i }).click();
  await expect(page).toHaveURL(/\/applications/);
  await expect(page.getByRole('heading', { name: /my applications/i })).toBeVisible();
  // Signed-out view should not fail the test
  await expect(page.getByText(/sign in/i).or(page.getByText(/no applications/i))).toBeVisible();
});
