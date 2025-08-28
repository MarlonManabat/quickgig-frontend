import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// minimal in-memory state for mocking
let jobs: any[] = [];
let applications: any[] = [];
let notifications: any[] = [];
let credits = 1;

test('@smoke golden e2e: post job -> apply -> chat -> hire', async ({ page }) => {
  // ---- routes ----
  await page.route(`${supa}/rest/v1/user_credits*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ credits }),
      });
    } else {
      route.continue();
    }
  });
  await page.route(`${supa}/rest/v1/rpc/decrement_credit`, (route) => {
    credits -= 1;
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(credits) });
  });
  await page.route(`${supa}/rest/v1/jobs`, (route) => {
    if (route.request().method() === 'POST') {
      const id = 'job-1';
      jobs.push({ id, title: 'Test Job', owner_id: 'employer' });
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id }]) });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(jobs) });
    }
  });
  await page.route('/api/locations/regions', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ regions: [{ code: 'NCR', name: 'NCR' }] }),
    });
  });
  await page.route('/api/locations/provinces?region=NCR', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ provinces: [{ code: 'NCR', name: 'NCR' }] }) });
  });
  await page.route('/api/locations/cities?province=NCR', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ cities: [{ code: 'MKT', name: 'Makati' }] }) });
  });
  await page.route('/api/applications/create', (route) => {
    const id = 'app-1';
    applications.push({ id, job_id: 'job-1', worker_id: 'worker', message: 'hello world message', expected_rate: 100, status: 'submitted', jobs: { title: 'Test Job' } });
    route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id }) });
  });
  await page.route(`${supa}/rest/v1/applications*`, (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(applications) });
  });
  await page.route('/api/messages/create', (route) => {
    notifications.push({ id: 'n1', user_id: 'worker', title: 'message', created_at: new Date().toISOString() });
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route('/api/applications/updateStatus', (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    const appRow = applications.find((a) => a.id === body.id);
    if (appRow) {
      appRow.status = body.status;
      notifications.push({ id: 'n2', user_id: 'worker', title: 'status', created_at: new Date().toISOString() });
    }
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route(`${supa}/rest/v1/notifications*`, (route) => {
    const url = new URL(route.request().url());
    const uid = url.searchParams.get('user_id')?.replace('eq.', '') || '';
    const items = notifications.filter((n) => n.user_id === uid).map((n) => ({ ...n, read: false, link: '/applications/app-1' }));
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(items) });
  });

  // ---- employer posts job ----
  await loginAs(page, 'employer');
  await page.goto(`${app}/jobs/new`);
  await page.fill('[data-testid=txt-title]', 'Test Job');
  await page.fill('[data-testid=txt-description]', 'This is a long description for testing.');
  await page.selectOption('[data-testid=sel-region]', 'NCR');
  await page.selectOption('[data-testid=sel-province]', 'NCR');
  await page.selectOption('[data-testid=sel-city]', 'MKT');
  await page.click('[data-testid=btn-submit]');
  await expect(page.getByText('Job posted!')).toBeVisible();

  // ---- worker applies ----
  await loginAs(page, 'worker');
  await page.goto(`${app}/jobs/job-1`);
  await page.fill('[data-testid=txt-message]', 'hello world message');
  await page.fill('[data-testid=txt-rate]', '100');
  await page.getByTestId('btn-apply').click();
  await expect(page).toHaveURL(`${app}/applications/app-1`);

  // ---- employer sends message ----
  await loginAs(page, 'employer');
  await page.goto(`${app}/applications/app-1`);
  await page.route('/api/messages/create', () => {}); // ensure route already set
  await page.evaluate(() => fetch('/api/messages/create', { method: 'POST', body: '{}' }));

  // ---- worker sees notification ----
  await loginAs(page, 'worker');
  await page.goto(`${app}/`);
  await expect(page.getByTestId('bell')).toBeVisible();
  await page.getByTestId('bell').click();
  await expect(page.getByTestId('notif-item').first()).toBeVisible();

  // ---- employer hires ----
  await loginAs(page, 'employer');
  await page.goto(`${app}/applications/app-1`);
  await page.getByTestId('hire').click();

  // ---- worker sees hired status ----
  await loginAs(page, 'worker');
  await page.goto(`${app}/me/applications`);
  await expect(page.getByTestId('status-pill')).toContainText('hired');
});
