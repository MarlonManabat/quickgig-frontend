import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, APP_HOST } from '../e2e/helpers';

test('nav my applications link auth-aware', async ({ page }) => {
  await page.goto('/');
  let link = page.getByTestId('nav-my-applications');
  if ((await link.count()) === 0) {
    link = page.getByRole('link', { name: /my applications/i });
  }
  await expect(link).toBeVisible();
  await link.click();
  await expectAuthAwareRedirect(
    page,
    new RegExp(`${APP_HOST.source}\/applications\/?$`)
  );
});
