import { test, expect } from '@playwright/test';
import { gotoHome, expectHref, reAuthAware } from './_helpers';

test('desktop header hrefs', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByTestId('nav-browse-jobs')).toBeVisible();
  await expectHref(page.getByTestId('nav-browse-jobs'), /^(?:\/browse-jobs(?:[?#].*)?)$/);
  await expectHref(page.getByTestId('nav-post-job'), reAuthAware('/post-jobs'));
  await expectHref(page.getByTestId('nav-my-applications'), reAuthAware('/applications'));
  await expectHref(page.getByTestId('nav-tickets'), /^(?:\/tickets(?:[?#].*)?)$/);
});
