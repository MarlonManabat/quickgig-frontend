import { test } from '@playwright/test';
import { expectHref, expectAuthAwareHref, rePath } from './_helpers';

test('desktop header CTAs', async ({ page }) => {
  await page.goto('/');

  await expectHref(page.getByTestId('nav-browse-jobs').first(), rePath('/browse-jobs'));
  await expectHref(page.getByTestId('nav-post-job').first(),     rePath('/post-jobs'));
  await expectAuthAwareHref(page, 'nav-my-applications', '/applications');
  await expectHref(page.getByTestId('nav-login').first(),        rePath('/login'));
});
