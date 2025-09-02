import { test, expect } from '@playwright/test';

async function gotoHome(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
}

async function clickNav(page, wanted) {
  if (wanted.testId) {
    const byId = page.getByTestId(wanted.testId);
    if (await byId.count()) {
      await byId.first().click();
      return;
    }
  }
  await page.getByRole('link', { name: wanted.name }).first().click();
}

test.describe('nav links work', () => {
  test('Home ▸ Browse Jobs', async ({ page }) => {
    await gotoHome(page);
    await clickNav(page, { testId: 'nav-browse-jobs', name: /browse jobs/i });
    await expect(page).toHaveURL(/\/(browse-jobs|jobs)/);
    await expect(page.getByRole('heading', { name: /browse jobs/i })).toBeVisible();
  });

  test('Home ▸ My Applications (signed out ok)', async ({ page }) => {
    await gotoHome(page);
    await clickNav(page, { testId: 'nav-my-applications', name: /my applications/i });
    // Middleware may redirect unauthenticated → accept either page
    await expect(page).toHaveURL(/\/(applications|login)/);
  });
});
