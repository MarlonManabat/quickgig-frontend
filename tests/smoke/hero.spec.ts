import { test, expect } from '@playwright/test';
import { hostAware } from './_helpers';

test('Landing hero CTA routes to Browse Jobs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-start')).toBeVisible();
  await page.getByTestId('hero-start').click();
  await expect(page).toHaveURL(hostAware(/\/browse-jobs\/?$/));
});
