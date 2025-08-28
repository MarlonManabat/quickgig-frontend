import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';
import { qaPost } from '../utils/qa';

const APP = process.env.PLAYWRIGHT_APP_URL || 'https://app.quickgig.ph';

test.skip('[full-e2e] employer posts job with credits', async ({
  page,
  request,
}) => {
  const title = `Credits Job ${Date.now()}`;
  const employer = { email: `employer+credits${Date.now()}@example.com` };

  await qaPost(request, '/api/qa/users/upsert', {
    email: employer.email,
    role: 'employer',
    tickets: 2,
  });

  await loginAs(page, 'employer');
  await page.goto(`${APP}/jobs/new`);

  await page.getByTestId('job-title').fill(title);
  await page.getByLabel(/description/i).fill('Auto job description');
  await page.getByTestId('job-submit').click();

  await expect(
    page.getByText(/job posted|credits have been updated/i)
  ).toBeVisible();
});

