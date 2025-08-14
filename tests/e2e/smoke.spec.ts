import { test, expect } from '@playwright/test';

test.describe('@smoke core flows', () => {
  test('home renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Kahit saan sa Pinas')).toBeVisible();
  });

  test('CTA -> /signup', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Simulan Na!?/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('Browse Jobs -> /find-work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Browse Jobs/i }).click();
    await expect(page).toHaveURL(/\/find-work/);
  });

  test('navbar links exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Find Work/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Post Job/i })).toBeVisible();
  });
});
