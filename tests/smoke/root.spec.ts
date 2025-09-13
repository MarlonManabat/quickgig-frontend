import { test, expect } from '@playwright/test';
import { expectToBeOnRoute } from './_helpers';

test('root "/" redirects to /browse-jobs (not 404)', async ({ page }) => {
  const resp = await page.goto('/', { waitUntil: 'domcontentloaded' });
  if (resp) expect(resp.status(), 'root must not return 404').not.toBe(404);
  await expectToBeOnRoute(page, '/browse-jobs');
});
