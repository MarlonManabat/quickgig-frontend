import { test } from '@playwright/test';
import { gotoHome, expectHref, reAuthAware } from './_helpers';

test('landing hero post job href', async ({ page }) => {
  await gotoHome(page);
  await expectHref(page.getByTestId('hero-cta-post-job'), reAuthAware('/post-jobs'));
});
