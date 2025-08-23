import { test, expect } from '@playwright/test';

test('auth CTA focuses email', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('cta-auth').click();
  await expect(page).toHaveURL('/auth?focus=email');
  await expect(page.locator('#email')).toBeFocused();
});

test('find work CTA focuses search', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('cta-findwork').click();
  await expect(page).toHaveURL('/gigs?focus=search');
  await expect(page.locator('#search')).toBeFocused();
});

test('post job CTA focuses title', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('cta-postjob').click();
  await expect(page).toHaveURL('/gigs/new?focus=title');
  await expect(page.locator('#title')).toBeFocused();
});
