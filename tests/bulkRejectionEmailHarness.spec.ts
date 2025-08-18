import { test, expect } from '@playwright/test';
import applicants from './fixtures/bulkApplicants.json';
import job from './fixtures/bulkJob.json';

const enabled = process.env.NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA === 'true';
const mode = process.env.ENGINE_MODE || 'mock';

test.skip(!enabled || mode !== 'mock', 'Bulk rejection QA disabled');

test('bulk rejection emails include applicant names and job title', async ({ page }) => {
  await page.goto('/qa/bulk-rejection');
  await page.getByTestId('bulk-trigger').click();
  const previews = page.getByTestId('bulk-email-preview');
  await expect(previews).toHaveCount(applicants.length);
  for (const a of applicants) {
    const preview = previews.filter({ hasText: a.name });
    await expect(preview).toContainText(a.name);
    await expect(preview).toContainText(job.title);
  }
  expect(await previews.first().innerText()).toMatchSnapshot('bulk-email-preview.txt');
});
