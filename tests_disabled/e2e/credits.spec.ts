import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('@full credits flow', async ({ page }) => {
  let credits = 3;
  await page.route(`${supa}/rest/v1/user_credits*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ credits }),
      });
    }
  });
  await page.route(`${supa}/rest/v1/rpc/decrement_credit`, (route) => {
    credits -= 1;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(credits),
    });
  });
  await page.route(`${supa}/rest/v1/rpc/grant_credits`, (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    credits += body.p_delta || 0;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(credits),
    });
  });
  await page.route(`${supa}/rest/v1/gigs`, (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1 }),
      });
    } else {
      route.continue();
    }
  });

  await loginAs(page, 'employer');
  await page.goto(app);
  await expect(page.getByTestId('credits-pill')).toHaveText('Credits: 3');

  await page.goto(`${app}/jobs/new`);
  await page.fill('input[name=title]', 'Test');
  await page.fill('textarea[name=description]', 'Desc');
  await page.fill('input[name=price]', '5');
  await page.click('button[type=submit]');
  await expect(page.getByTestId('credits-pill')).toHaveText('Credits: 2');

  credits = 0;
  await page.goto(`${app}/jobs/new`);
  await expect(page.getByText('You have 0 credits')).toBeVisible();

  await loginAs(page, 'admin');
  await page.goto(`${app}/admin/credits`);
  await page.fill('input[placeholder="user id or email"]', 'user-1');
  await page.click('text=Lookup');
  await page.click('text=+3');
  await expect(page.getByText('Credits: 3')).toBeVisible();
});
