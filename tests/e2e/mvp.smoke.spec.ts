import { test, expect, Page } from '@playwright/test';
import { loginAs, seedBasic, waitForAppReady, ensureOnJobsNew } from './_helpers/session';

async function safeFill(page: Page, testId: string, value: string) {
  const selector = `[data-testid="${testId}"]`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 5_000 });
      await page.fill(selector, value, { timeout: 5_000 });
      return;
    } catch (err) {
      console.warn(`safeFill retry ${attempt} for ${testId}`, err);
      if (attempt === 3) throw err;
      await page.waitForTimeout(500 * attempt);
    }
  }
}

async function safeSelect(page: Page, testId: string, value: string) {
  const selector = `[data-testid="${testId}"]`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 5_000 });
      await page.selectOption(selector, value, { timeout: 5_000 });
      return;
    } catch (err) {
      console.warn(`safeSelect retry ${attempt} for ${testId}`, err);
      if (attempt === 3) throw err;
      await page.waitForTimeout(500 * attempt);
    }
  }
}

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// minimal in-memory state for mocking
let jobs: any[] = [];
let applications: any[] = [];
let notifications: any[] = [];
let credits = 1;

test('@smoke golden e2e: post job -> apply -> chat -> hire', async ({ page, request }) => {
  test.slow();
  test.setTimeout(60_000);

  await test.step('seed + login', async () => {
    await seedBasic(request);
    await loginAs(page, 'employer');
  });

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
  await test.step('open new job form', async () => {
    await ensureOnJobsNew(page);

    const haveRegion = page.locator('[data-testid=sel-region]');
    const haveProvince = page.locator('[data-testid=sel-province]');
    await haveRegion.waitFor({ state: 'visible', timeout: 15_000 });
    await haveProvince.waitFor({ state: 'visible', timeout: 15_000 });
  });

  await test.step('fill job form', async () => {
    await safeFill(page, 'txt-title', 'Test Job');
    await safeFill(page, 'txt-description', 'This is a long description for testing.');

    await page.waitForFunction(
      (sel) => !!document.querySelector(sel)?.querySelector('option'),
      '[data-testid=sel-region]',
      { timeout: 15_000 },
    );
    await safeSelect(page, 'sel-region', 'NCR');

    await page.waitForFunction(
      (sel) => !!document.querySelector(sel)?.querySelector('option'),
      '[data-testid=sel-province]',
      { timeout: 15_000 },
    );
    await safeSelect(page, 'sel-province', 'NCR');

    await safeSelect(page, 'sel-city', 'MKT');
    await page.waitForSelector('[data-testid="btn-submit"]', { timeout: 20_000 });
    await page.getByTestId('btn-submit').click();
    await page.waitForSelector('text=Job posted!');
  });

  // ---- worker applies ----
  await test.step('worker applies', async () => {
    await loginAs(page, 'worker');
    await page.goto(`${app}/jobs/job-1`);
    await waitForAppReady(page);
    await safeFill(page, 'txt-message', 'hello world message');
    await safeFill(page, 'txt-rate', '100');
    await page.waitForSelector('[data-testid="btn-apply"]', { timeout: 20_000 });
    await page.getByTestId('btn-apply').click();
    await page.waitForURL(`${app}/applications/app-1`);
  });

  // ---- employer sends message ----
  await test.step('employer sends message', async () => {
    await loginAs(page, 'employer');
    await page.goto(`${app}/applications/app-1`);
    await waitForAppReady(page);
    await page.waitForSelector('[data-testid="hire"]', { timeout: 20_000 });
    await page.route('/api/messages/create', () => {}); // ensure route already set
    await page.evaluate(() => fetch('/api/messages/create', { method: 'POST', body: '{}' }));
  });

  // ---- worker sees notification ----
  await test.step('worker sees notification', async () => {
    await loginAs(page, 'worker');
    await page.goto(`${app}/`);
    await waitForAppReady(page);
    await page.waitForSelector('[data-testid="bell"]', { timeout: 20_000 });
    await page.getByTestId('bell').click();
    await page.waitForSelector('[data-testid="notif-item"]', { timeout: 20_000 });
  });

  // ---- employer hires ----
  await test.step('employer hires', async () => {
    await loginAs(page, 'employer');
    await page.goto(`${app}/applications/app-1`);
    await waitForAppReady(page);
    await page.waitForSelector('[data-testid="hire"]', { timeout: 20_000 });
    await page.getByTestId('hire').click();
  });

  // ---- worker sees hired status ----
  await test.step('worker sees hired status', async () => {
    await loginAs(page, 'worker');
    await page.goto(`${app}/me/applications`);
    await waitForAppReady(page);
    await page.waitForSelector('[data-testid="status-pill"]', { timeout: 20_000 });
    await expect(page.getByTestId('status-pill')).toContainText('hired');
  });
});
