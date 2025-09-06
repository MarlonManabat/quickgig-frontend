import { test, expect } from '@playwright/test';
import { loginAs, isProdBase } from './helpers';

test.skip(isProdBase(), 'Auth helper (/api/test/login-as) is disabled on production host.');

const JOB_TITLE = 'E2E Created Job';

test('employer creates a job and sees it listed @auth', async ({ page, baseURL }) => {
  const { userId } = await loginAs(baseURL!, 'employer', page);

  await page.request.post('/api/jobs/create', {
    data: {
      title: JOB_TITLE,
      description: 'E2E job created via API',
      created_by: userId,
      region: '130000000',
      city: 'Manila',
    },
  });

  await page.goto('/browse-jobs');
  await expect(page.getByText(JOB_TITLE)).toBeVisible();
});
