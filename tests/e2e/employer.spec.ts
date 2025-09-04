import { test, expect } from '@playwright/test';
import { loginAs, isProdBase } from './helpers';

test.skip(isProdBase(), 'Auth helper (/api/test/login-as) is disabled on production host.');

const GIG_TITLE = 'E2E Created Gig';

test('employer creates a gig and sees it listed @auth', async ({ page, baseURL }) => {
  const { userId } = await loginAs(baseURL!, 'employer', page);

  await page.request.post('/api/gigs/create', {
    data: {
      title: GIG_TITLE,
      company: 'Test Co',
      description: 'E2E gig created via API',
      user_id: userId,
      region_code: '130000000',
      city_code: '137401000',
      budget: 123,
    },
  });

  await page.goto('/gigs');
  await expect(page.getByText(GIG_TITLE)).toBeVisible();
});
