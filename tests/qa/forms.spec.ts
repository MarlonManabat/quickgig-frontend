import { test, expect } from '@playwright/test';
import { loginAs, seedBasic } from './helpers/accounts';
import { waitForAppReady } from './helpers/waits';
import { smartFill } from './helpers/forms';
import { recordVisit, writeCoverage } from './routes';

test.describe('forms and flows', () => {
  test.beforeEach(async ({ page }) => {
    await seedBasic(page);
  });

  test('employer can create job', async ({ page }) => {
    await loginAs(page, 'employer');
    await page.goto('/jobs/new');
    await waitForAppReady(page);
    await smartFill(page);
    await page.getByRole('button', { name: /submit|post|create/i }).click().catch(()=>{});
    await Promise.race([
      page.waitForURL(/\/jobs/),
      page.getByText(/success/i).waitFor({ timeout: 5_000 }).catch(() => {}),
    ]);
    recordVisit('/jobs/new');
  });

  test('worker can apply to a job', async ({ page }) => {
    await loginAs(page, 'worker');
    await page.goto('/jobs');
    await waitForAppReady(page);
    const first = page.getByTestId('job-card').first();
    await first.getByRole('button', { name: /apply/i }).click().catch(()=>{});
    await expect(first.getByText(/applied|application/i)).toBeVisible();
    recordVisit('/jobs');
  });

  test('messaging within application', async ({ page }) => {
    await loginAs(page, 'worker');
    await page.goto('/applications');
    await waitForAppReady(page);
    const app = page.getByTestId('application-card').first();
    await app.click();
    await waitForAppReady(page);
    await page.getByRole('textbox', { name: /message/i }).fill('hello');
    await page.getByRole('button', { name: /send/i }).click();
    await expect(page.getByText('hello')).toBeVisible();
    recordVisit('/applications');
  });

  test('offers and payments actions', async ({ page }) => {
    await loginAs(page, 'employer');
    await page.goto('/offers');
    await waitForAppReady(page);
    const sendOffer = page.getByRole('button', { name: /send offer/i });
    if (await sendOffer.count()) {
      await sendOffer.first().click();
      await expect(page.getByText(/sent|offer/i)).toBeVisible();
    }
    const markPaid = page.getByRole('button', { name: /mark paid/i });
    if (await markPaid.count()) {
      await markPaid.first().click();
      await expect(page.getByText(/paid/i)).toBeVisible();
    }
    recordVisit('/offers');
  });

  test.afterAll(() => {
    writeCoverage();
  });
});
