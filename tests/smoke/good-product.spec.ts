import { test } from '@playwright/test';
import { expectHref, reAuthAware, gotoHome } from './_helpers';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('good product smoke', async ({ page }) => {
      await gotoHome(page);
      await expectHref(page.getByTestId('nav-browse-jobs'), /^(?:\/browse-jobs(?:[?#].*)?)$/);
      await expectHref(page.getByTestId('nav-post-job'), reAuthAware('/post-jobs'));
      await expectHref(page.getByTestId('nav-my-applications'), reAuthAware('/applications'));
      await expectHref(page.getByTestId('nav-tickets'), /^(?:\/tickets(?:[?#].*)?)$/);
    });
  });
}
