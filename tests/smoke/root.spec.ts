import { test } from '@playwright/test';
import { expectToBeOnRoute } from '../e2e/helpers';

test('root "/" redirects to /browse-jobs (not 404)', async ({ page }) => {
  await page.goto('/');
  await expectToBeOnRoute(page, '/browse-jobs');
});
