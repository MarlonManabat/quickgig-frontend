import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('@full worker can send message', async ({ page }) => {
  await loginAs(page, 'worker');
  await page.route(`${supa}/rest/v1/applications*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'app-1',
          job_id: 'job-1',
          worker_id: 'worker-1',
          status: 'accepted',
          job: { title: 'Job', employer_id: 'employer-1' },
        },
      ]),
    });
  });
  await page.route(`${supa}/rest/v1/profiles*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 'employer-1', full_name: 'Employer' }]),
    });
  });
  await page.route('**/api/messages/history?*', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [] }) });
  });
  let body: any = null;
  await page.route('**/api/messages/create', (route) => {
    body = JSON.parse(route.request().postData() || '{}');
    route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'm1' }) });
  });
  await page.goto(`${app}/applications/app-1`);
  await page.fill('[data-testid=msg-input]', 'Hello there');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('msg-bubble')).toContainText('Hello there');
  expect(body.body).toBe('Hello there');
});

