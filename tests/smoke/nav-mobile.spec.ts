import { test } from '@playwright/test';
import { openMobileMenu, expectHref, reAuthAware, gotoHome } from './_helpers';

test('mobile header hrefs', async ({ page }) => {
  await gotoHome(page);
  await openMobileMenu(page);
  await expectHref(page.getByTestId('nav-browse-jobs'), /^(?:\/browse-jobs(?:[?#].*)?)$/);
  await expectHref(page.getByTestId('nav-post-job'), reAuthAware('/post-jobs'));
  await expectHref(page.getByTestId('nav-my-applications'), reAuthAware('/applications'));
  await expectHref(page.getByTestId('nav-tickets'), /^(?:\/tickets(?:[?#].*)?)$/);
});
