import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';
test('Post page loads with no console errors', async ({ page }) => {
  const errs:string[]=[]; page.on('console',m=>m.type()==='error'&&errs.push(m.text())); page.on('pageerror',e=>errs.push(String(e)));
  await page.goto(`${APP}/post`, { waitUntil:'domcontentloaded' });
  await expect(page.getByRole('button', { name:/post job|post a job/i })).toBeVisible();
  expect(errs, 'console/page errors on /post').toEqual([]);
});
