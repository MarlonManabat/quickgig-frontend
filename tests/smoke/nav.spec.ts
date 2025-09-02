import { test, expect } from '@playwright/test';
import { BASE } from '../smoke.env';

test('nav links work', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('nav-browse-jobs').click();
  await expect(page).toHaveURL(/\/browse-jobs/);
  await page.goBack();
  await page.getByTestId('nav-my-applications').click();
  await expect(page).toHaveURL(/\/(applications|login)/);
});
