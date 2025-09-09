import { test, expect } from '@playwright/test';
import { gotoHome, expectHref, reAuthAware } from './_helpers';

test('landing header hrefs', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByTestId('nav-post-job')).toBeVisible();
  await expectHref(page.getByTestId('nav-post-job'), reAuthAware('/post-jobs'));
  await expectHref(page.getByTestId('nav-my-applications'), reAuthAware('/applications'));
});
