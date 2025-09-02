import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || '/';

async function gotoHome(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Ensure hydration / header rendered
  await page.waitForLoadState('networkidle');
}

async function clickWithFallback(page, testId, roleName) {
  const byId = page.getByTestId(testId);
  if (await byId.count()) {
    await byId.first().click();
    return;
  }
  await page.getByRole('link', { name: roleName }).first().click();
}

test.describe('Hero', () => {
  test('Browse jobs works', async ({ page }) => {
    await gotoHome(page);
    await clickWithFallback(page, 'hero-browse-jobs', /browse jobs/i);
    await expect(page).toHaveURL(/\/(browse-jobs|jobs)/);
    await expect(page.getByRole('heading', { name: /browse jobs/i })).toBeVisible({ timeout: 10_000 });
  });

  test('Post a job works (shell)', async ({ page }) => {
    await gotoHome(page);
    await clickWithFallback(page, 'hero-post-job', /post a job/i);
    // allow any of our create/post routes
    await expect(page).toHaveURL(/\/(gigs\/create|post|post-a-job)/);
  });
});
