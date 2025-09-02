import { test, expect } from '@playwright/test';

test('Home → Browse Jobs renders', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByTestId('nav-browse-jobs').click();
  await expect(page).toHaveURL(/\/browse-jobs/);
  await expect(page.getByRole('heading', { name: /browse jobs/i })).toBeVisible();
  // Either an empty state or at least one job item is fine
  await expect(page.getByText(/no jobs yet/i).or(page.locator('li').first())).toBeVisible();
});

test('Home → My Applications renders (signed out ok)', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByTestId('nav-my-applications').click();
  // Middleware may redirect to /login; accept both outcomes
  await expect(page).toHaveURL(/\/(applications|login)/);
  if ((await page.url()).includes('/login')) {
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: /my applications/i })).toBeVisible();
  }
});
