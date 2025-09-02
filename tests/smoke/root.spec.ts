import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

test('root "/" redirects to /browse-jobs', async ({ page }) => {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });

  // Redirect should land on /browse-jobs
  await expect(page).toHaveURL(/\/browse-jobs\/?$/);

  // Prove the shell/content rendered: prefer a stable test id in the top nav,
  // otherwise fall back to a visible "Browse jobs" link anywhere.
  const navLink = page.getByTestId('nav-browse-jobs').first();
  if (await navLink.count()) {
    await expect(navLink).toBeVisible({ timeout: 5000 });
  } else {
    await expect(page.getByRole('link', { name: /browse jobs/i }).first()).toBeVisible({ timeout: 5000 });
  }
});
