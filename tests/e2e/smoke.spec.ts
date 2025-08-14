import { test, expect } from '@playwright/test';

const paths = ['/', '/find-work', '/post-job'];

for (const path of paths) {
  test(`@smoke page ${path} responds and nav links render`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status(), `GET ${path}`).toBeLessThan(400);
    await expect(page.getByRole('link', { name: /Find Work/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Post Job/i })).toBeVisible();
  });
}
