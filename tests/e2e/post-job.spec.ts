import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('@full post job end-to-end', async ({ page }) => {
  let credits = 1;
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
  await page.route(`${supa}/rest/v1/jobs`, (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1 }]),
      });
    } else {
      route.continue();
    }
  });

  await page.route('/api/locations/regions', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ regions: [{ code: '040000000', name: 'CALABARZON' }] }),
    });
  });
  await page.route('/api/locations/provinces?region=040000000', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ provinces: [{ code: '042100000', name: 'Cavite' }] }),
    });
  });
  await page.route('/api/locations/cities?province=042100000', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ cities: [{ code: '042108000', name: 'Bacoor' }] }),
    });
  });

  await loginAs(page, 'employer');
  await page.goto(`${app}/jobs/new`);
  await page.fill('input[name=title]', 'Test Job');
  await page.fill('textarea[name=description]', 'Desc');
  await page.selectOption('[data-testid=region-select]', '040000000');
  await page.selectOption('[data-testid=province-select]', '042100000');
  await page.selectOption('[data-testid=city-select]', '042108000');
  await page.click('button[type=submit]');
  await expect(page.getByText('Job posted!')).toBeVisible();
  await expect(page.getByTestId('credits-pill')).toHaveText('Credits: 0');

  credits = 0;
  await page.goto(`${app}/jobs/new`);
  await expect(page.getByText('You have 0 credits')).toBeVisible();

  const bad = await page.request.post(`${app}/api/jobs/create`, {
    data: {
      title: 'Bad',
      description: 'Bad',
      region_code: '040000000',
      province_code: 'NCR',
      city_code: '042108000',
    },
  });
  expect(bad.status()).toBe(400);
});
