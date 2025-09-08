import { test } from '@playwright/test';
import { expectListOrEmpty } from './_helpers';

test('Browse list renders', async ({ page }) => {
  await page.goto('/browse-jobs');
  await expectListOrEmpty(page, 'jobs-list', {
    itemTestId: 'job-card',
    emptyTestId: 'jobs-empty',
  });
});
