import { test } from '@playwright/test';
import { expectListOrEmpty } from './_helpers';

test('Browse list renders', async ({ page }) => {
  await page.goto('/browse-jobs');
  await expectListOrEmpty(
    page,
    'jobs-list',
    { text: /(no jobs yet|empty)/i }
  );
});
