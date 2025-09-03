import { test, expect } from '@playwright/test';

test('root "/" redirects to /browse-jobs (not 404)', async ({ page }) => {
  const resp = await page.goto('/', { waitUntil: 'domcontentloaded' });
  if (resp) expect(resp.status(), 'root must not return 404').not.toBe(404);
  await expect(page).toHaveURL(/\/browse-jobs\/?/);
});
