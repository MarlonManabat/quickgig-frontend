import { expect, test } from '@playwright/test';

import { expectLoginOrPkce, loginAs } from './helpers';

test.describe('QuickGig core flows', () => {
  test('browse jobs and apply redirect', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/browse-jobs/);

    const cards = page.locator('[data-testid="job-card"]');
    const count = await cards.count();

    if (count > 0) {
      await cards.first().click();
      await expect(page).toHaveURL(/\/jobs\//);
      await page.locator('[data-testid="apply-button"]').click();
      await expectLoginOrPkce(page);
    } else {
      await expect(page.locator('[data-testid="jobs-empty"]')).toBeVisible();
    }
  });

  test('applications require auth', async ({ page }) => {
    await page.goto('/applications');
    await expectLoginOrPkce(page);
  });

  test('post job flow for employer', async ({ page, browserName }) => {
    await page.goto('/gigs/create');
    await expectLoginOrPkce(page);

    const title = `Automation QA ${Date.now()}`;

    await loginAs(page, 'employer', '/gigs/create');

    await expect(page.locator('[data-testid="post-job-form"]')).toBeVisible();

    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="description"]', 'Testing automation gig description');

    await page.locator('#region').click();
    await page.locator('[role="option"]', { hasText: 'National Capital Region' }).click();
    await page.locator('#city').click();
    await page.locator('[role="option"]', { hasText: 'Quezon City' }).click();

    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/browse-jobs/);

    const list = page.locator('[data-testid="jobs-list"] [data-testid="job-card"]');
    await expect(list.first()).toContainText(title);
  });
});
