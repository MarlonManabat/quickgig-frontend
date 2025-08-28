import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('@full worker apply happy path and credits isolation', async ({ page }) => {
  await loginAs(page, 'worker');
  const job = {
    id: 'job-1',
    title: 'Open Job',
    description: 'Job desc',
    owner_id: 'employer-1',
    is_closed: false,
  };
  await page.route(`${supa}/rest/v1/jobs*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([job]),
      });
    }
  });
  await page.route('/api/applications/create', (route) => {
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'app-1' }),
    });
  });
  await page.route(`${supa}/rest/v1/applications*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'app-1',
          job_id: 'job-1',
          worker_id: 'worker-1',
          message: 'This is a long message for testing.',
          expected_rate: 123,
          status: 'submitted',
          jobs: { title: 'Open Job' },
        },
      ]),
    });
  });
  let credits = 5;
  await page.route(`${supa}/rest/v1/user_credits*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ credits }),
      });
    }
  });

  await page.goto(`${app}/jobs/job-1`);
  await page.fill('[data-testid=txt-message]', 'This is a long message for testing.');
  await page.fill('[data-testid=txt-rate]', '123');
  await page.getByTestId('btn-apply').click();
  await expect(page).toHaveURL(`${app}/applications/app-1`);
  await expect(page.getByText('Application')).toBeVisible();

  // credits unchanged after application
  await loginAs(page, 'employer');
  await page.goto(app);
  await expect(page.getByTestId('credits-pill')).toHaveText('Credits: 5');
});

test('@full duplicate application blocked', async ({ page }) => {
  await loginAs(page, 'worker');
  const job = {
    id: 'job-1',
    title: 'Open Job',
    description: 'Job desc',
    owner_id: 'employer-1',
    is_closed: false,
  };
  await page.route(`${supa}/rest/v1/jobs*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([job]),
      });
    }
  });
  await page.route('/api/applications/create', (route) => {
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 'DUPLICATE_APPLICATION' } }),
    });
  });
  await page.goto(`${app}/jobs/job-1`);
  await page.fill('[data-testid=txt-message]', 'This is a long message for testing.');
  await page.fill('[data-testid=txt-rate]', '123');
  await page.getByTestId('btn-apply').click();
  await expect(page.getByText('You already applied to this job')).toBeVisible();
});

test('@full validation errors on apply form', async ({ page }) => {
  await loginAs(page, 'worker');
  const job = {
    id: 'job-1',
    title: 'Open Job',
    description: 'Job desc',
    owner_id: 'employer-1',
    is_closed: false,
  };
  await page.route(`${supa}/rest/v1/jobs*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([job]),
      });
    }
  });
  await page.goto(`${app}/jobs/job-1`);
  await page.fill('[data-testid=txt-message]', 'short');
  await page.fill('[data-testid=txt-rate]', '0');
  await page.getByTestId('btn-apply').click();
  await expect(page.getByText('Message too short')).toBeVisible();
  await expect(page.getByText('Rate must be > 0')).toBeVisible();
});

test('@full closed job blocks applications', async ({ page }) => {
  await loginAs(page, 'worker');
  const job = {
    id: 'job-2',
    title: 'Closed Job',
    description: 'Job desc',
    owner_id: 'employer-1',
    is_closed: true,
  };
  await page.route(`${supa}/rest/v1/jobs*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([job]),
      });
    }
  });
  await page.goto(`${app}/jobs/job-2`);
  await expect(page.getByText('Applications closed')).toBeVisible();
  await expect(page.locator('[data-testid=btn-apply]')).toHaveCount(0);
});
