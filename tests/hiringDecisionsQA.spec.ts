import { test, expect } from '@playwright/test';
import data from './fixtures/hiringApplicants.json';

const enabled = process.env.NEXT_PUBLIC_ENABLE_HIRING_QA === 'true';
const mode = process.env.ENGINE_MODE || 'mock';

test.skip(!enabled || mode !== 'mock', 'Hiring decisions QA disabled');

test('hiring decisions closeout harness renders markers', async ({ page }) => {
  await page.goto('/qa/hiring-decisions?auto=1');
  const hired = page.getByTestId('status-hired');
  await expect(hired).toHaveCount(data.accepted.length);
  const rejected = page.getByTestId('status-not_selected');
  await expect(rejected).toHaveCount(data.rejected.length);
  await expect(page.getByTestId('closeout-preview')).toBeVisible();
});
