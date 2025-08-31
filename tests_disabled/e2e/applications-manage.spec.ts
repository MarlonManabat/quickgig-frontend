import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('@full applications manage flow', async ({ page }) => {
  const job = {
    id: 'job-1',
    title: 'My Job',
    description: 'desc',
    owner_id: 'employer-1',
    is_closed: false,
  };
  const appRow: any = {
    id: 'app-1',
    job_id: job.id,
    worker_id: 'worker-1',
    message: 'This is a long message for testing.',
    expected_rate: 123,
    status: 'submitted',
    created_at: new Date().toISOString(),
    worker: { full_name: 'Worker One' },
  };
  let notifications: any[] = [];

  await loginAs(page, 'employer');
  await page.route(`${supa}/rest/v1/jobs*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([job]),
      });
    }
  });
  await page.route(`${supa}/rest/v1/applications*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([appRow]),
      });
    }
  });
  await page.route('/api/applications/updateStatus', (route) => {
    const body = route.request().postDataJSON();
    appRow.status = body.status;
    notifications.push({
      id: `n-${notifications.length}`,
      title: 'Application status updated',
      link: `/applications/${appRow.id}`,
      read: false,
      created_at: new Date().toISOString(),
    });
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route('/api/jobs/close', (route) => {
    job.is_closed = true;
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route(`${supa}/rest/v1/notifications*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(notifications),
    });
  });

  await page.goto(`${app}/jobs/${job.id}`);
  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(page.getByText('accepted')).toBeVisible();

  // worker sees accepted + notification
  await loginAs(page, 'worker');
  await page.route(`${supa}/rest/v1/jobs*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([job]),
      });
    }
  });
  await page.route(`${supa}/rest/v1/applications*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([appRow]),
    });
  });
  await page.goto(`${app}/applications/${appRow.id}`);
  await expect(page.getByText('accepted')).toBeVisible();
  await page.goto(`${app}/jobs/${job.id}`); // to use header
  await page.locator('button[aria-label="Notifications"]').click();
  await expect(page.locator('text=Application status updated')).toBeVisible();

  // reset for decline
  notifications = [];
  appRow.status = 'submitted';
  await loginAs(page, 'employer');
  await page.goto(`${app}/jobs/${job.id}`);
  await page.getByRole('button', { name: 'Decline' }).click();
  await expect(page.getByText('declined')).toBeVisible();

  // worker sees declined + notification
  await loginAs(page, 'worker');
  await page.route(`${supa}/rest/v1/applications*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([appRow]),
    });
  });
  await page.goto(`${app}/applications/${appRow.id}`);
  await expect(page.getByText('declined')).toBeVisible();

  // close job
  await loginAs(page, 'employer');
  await page.goto(`${app}/jobs/${job.id}`);
  await page.getByTestId('btn-close-job').click();
  await expect(page.getByTestId('job-closed-banner')).toBeVisible();

  // worker cannot apply again
  await loginAs(page, 'worker');
  await page.route(`${supa}/rest/v1/jobs*`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([job]),
      });
    }
  });
  await page.goto(`${app}/jobs/${job.id}`);
  await expect(page.locator('[data-testid=btn-apply]')).toHaveCount(0);

  // RLS: worker cannot call APIs
  await page.route('/api/jobs/close', (route) => {
    route.fulfill({ status: 401 });
  });
  await page.route('/api/applications/updateStatus', (route) => {
    route.fulfill({ status: 401 });
  });
  const closeResp = await page.evaluate(() =>
    fetch('/api/jobs/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: 'job-1' }),
    }).then((r) => r.status),
  );
  expect(closeResp).toBe(401);
  const statusResp = await page.evaluate(() =>
    fetch('/api/applications/updateStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: 'app-1', status: 'accepted' }),
    }).then((r) => r.status),
  );
  expect(statusResp).toBe(401);
});
