import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

test('root "/" redirects to /browse-jobs (no content assertion)', async ({ page }) => {
  const start = `${BASE}/`;

  // Navigate to root; if we get a response, it must not be 404.
  const resp = await page.goto(start, { waitUntil: 'domcontentloaded' });
  if (resp) {
    expect(resp.status(), 'root must not return 404').not.toBe(404);
  }

  // Assert we landed on /browse-jobs (allow trailing slash and query).
  await expect(page).toHaveURL(/\/browse-jobs\/?(?:\?.*)?$/, { timeout: 15000 });

  // Give the shell a moment to settle so future steps aren’t racing redirects.
  await page.waitForLoadState('networkidle');
});
