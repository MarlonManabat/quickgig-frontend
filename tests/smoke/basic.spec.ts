import { test, expect } from '@playwright/test';

test('homepage + core routes work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /QuickGig\.ph/i })).toBeVisible();

  // Primary CTA to find work should route
  const findWork = page
    .getByRole('button', { name: /Hanap Trabaho/i })
    .or(page.getByRole('link', { name: /Find Work/i }));
  if (await findWork.isVisible()) {
    await findWork.click();
  }
  await expect(page).toHaveURL(/\/(find|search|gigs)/);

  // Auth screen renders
  await page.goto('/auth');
  await expect(page.getByLabel(/Email/i)).toBeVisible();

  // Guard redirects unauthenticated to /auth
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/auth/);
});
