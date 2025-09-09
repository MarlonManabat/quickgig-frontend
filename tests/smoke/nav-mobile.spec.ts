import { test } from '@playwright/test';
import { expectHref, expectAuthAwareHref, rePath } from './_helpers';

async function openMobileMenu(page) {
  await page.getByTestId('nav-menu').first().click();
}

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  await openMobileMenu(page);
  await expectHref(page.getByTestId('nav-browse-jobs').first(), rePath('/browse-jobs'));
  await expectHref(page.getByTestId('nav-post-job').first(),     rePath('/post-jobs'));
  await expectAuthAwareHref(page, 'nav-my-applications', '/applications');
  await expectHref(page.getByTestId('nav-login').first(),        rePath('/login'));
});
