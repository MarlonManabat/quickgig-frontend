import { test, expect } from '@playwright/test';

test('root "/" renders landing hero', async ({ page }) => {
  const resp = await page.goto('/', { waitUntil: 'domcontentloaded' });
  if (resp) expect(resp.status(), 'root must return 200').toBe(200);
  await expect(page.getByTestId('hero-start')).toBeVisible();
});
