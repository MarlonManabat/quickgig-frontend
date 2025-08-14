import { test, expect, type Page } from '@playwright/test';

const home = async (page: Page) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'QuickGig' })).toBeVisible();
  await page.getByRole('link', { name: 'Simulan Na!' }).click();
  await expect(page).toHaveURL(/\/signup/);
  await page.goBack();
  await page.getByRole('link', { name: 'Browse Jobs' }).click();
  await expect(page).toHaveURL(/\/find-work/);
};

const checkFindWork = async (page: Page) => {
  await page.goto('/find-work');
  const emptyState = page.getByText('Walang jobs ngayon');
  const jobCard = page.getByRole('button', { name: 'Apply' });
  await Promise.race([
    emptyState.waitFor({ state: 'visible' }),
    jobCard.first().waitFor({ state: 'visible' }),
  ]);
};

const postJob = async (page: Page) => {
  await page.goto('/post-job');
  await expect(page.locator('form')).toBeVisible();
};

test('home page headline and CTAs', async ({ page }) => {
  await home(page);
});

test('find-work lists jobs or empty state', async ({ page }) => {
  await checkFindWork(page);
});

test('post-job form exists', async ({ page }) => {
  await postJob(page);
});
