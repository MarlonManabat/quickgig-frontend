import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('@full post job flow', async ({ page }) => {
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
      body: JSON.stringify({
        regions: [
          { code: '040000000', name: 'CALABARZON' },
          { code: 'NCR', name: 'NCR' },
        ],
      }),
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
  await page.route('/api/locations/cities?province=NCR', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ cities: [{ code: 'MKT', name: 'Makati' }] }),
    });
  });

  await loginAs(page, 'employer');

  // Happy path
  await page.goto(`${app}/jobs/new`);
  await page.fill('[data-testid=txt-title]', 'Test Job');
  await page.fill(
    '[data-testid=txt-description]',
    'This is a long description for testing.',
  );
  await page.selectOption('[data-testid=sel-region]', '040000000');
  await page.selectOption('[data-testid=sel-province]', '042100000');
  await page.selectOption('[data-testid=sel-city]', '042108000');
  await page.click('[data-testid=btn-submit]');
  await expect(page.getByText('Job posted!')).toBeVisible();
  await expect(page.getByTestId('credits-pill')).toHaveText('Credits: 0');

  // No credits gate
  await page.goto(`${app}/jobs/new`);
  await expect(page.getByText('You have 0 credits')).toBeVisible();

  // Validation: short title / missing city
  credits = 1;
  await page.goto(`${app}/jobs/new`);
  await page.fill('[data-testid=txt-title]', 'no');
  await page.fill(
    '[data-testid=txt-description]',
    'This is a long description for testing.',
  );
  await page.selectOption('[data-testid=sel-region]', '040000000');
  await page.selectOption('[data-testid=sel-province]', '042100000');
  // city not selected
  await expect(page.getByTestId('btn-submit')).toBeDisabled();

  // NCR flow
  await page.goto(`${app}/jobs/new`);
  await page.fill('[data-testid=txt-title]', 'Another Job');
  await page.fill(
    '[data-testid=txt-description]',
    'This is a long description for NCR flow.',
  );
  await page.selectOption('[data-testid=sel-region]', 'NCR');
  await expect(page.locator('[data-testid=sel-province]')).toHaveValue('NCR');
  await page.selectOption('[data-testid=sel-city]', 'MKT');
  await page.click('[data-testid=btn-submit]');
  await expect(page.getByText('Job posted!')).toBeVisible();
});
