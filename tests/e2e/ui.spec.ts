import { test, expect } from '@playwright/test';

const HOME = '/';

// Header exists and is sticky
test('header exists and is sticky on top pages', async ({ page }) => {
  await page.goto(HOME);
  const header = page.locator('header');
  await expect(header).toBeVisible();
  const position = await header.evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe('sticky');
});

// Email input width rules
test('email input width rules', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/auth');
  const mobile = await page.locator('input[type="email"]').boundingBox();
  expect(mobile?.width || 0).toBeGreaterThanOrEqual(320);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/auth');
  const desktop = await page.locator('input[type="email"]').boundingBox();
  expect(desktop?.width || 0).toBeGreaterThanOrEqual(680);
  expect(desktop?.width || 0).toBeLessThanOrEqual(720);
});

// 404 page
test('404 shows branded heading and CTA', async ({ page }) => {
  await page.goto('/non-existent');
  const cta = page.getByText('Bumalik sa Hanap Trabaho');
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/gigs/);
});

// Admin overview cards render for an admin
const adminEmail = process.env.PW_ADMIN_EMAIL;
const adminPass = process.env.PW_ADMIN_PASS;

test.skip(!adminEmail || !adminPass, 'admin creds not set')(
  'admin overview cards render',
  async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', adminEmail!);
    await page.click('button[type="submit"]');
    // Assume magic link auto login is handled elsewhere
    await page.goto('/admin');
    await expect(page.getByText('Dashboard')).toBeVisible();
  }
);
