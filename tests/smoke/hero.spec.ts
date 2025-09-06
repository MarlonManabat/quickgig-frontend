import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareRedirect } from './_helpers';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await gotoHome(page);
  const browse = page.getByTestId('nav-browse-jobs').first();
  await expect(browse).toHaveAttribute('href', '/browse-jobs');

  const post = page.getByTestId('nav-post-job').first();
  await expect(post).toHaveAttribute('href', '/post-job');
  await post.click();
  await expectAuthAwareRedirect(page, '/post-job');
});
