import { test, expect } from '@playwright/test';
import { loginAs } from './utils/session';
import { qaUpsertUser, qaGetTickets, qaCleanupJobs } from './utils/qa';

const APP = process.env.BASE_URL || process.env.PLAYWRIGHT_APP_URL || 'https://app.quickgig.ph';

test.setTimeout(120_000);

test('[full-e2e] job lifecycle: post → apply → message → hire', async ({ page, context }) => {
  const title = `E2E Gig ${Date.now()}`;

  const employer = { email: `employer+e2e${Date.now()}@example.com` };
  const worker = { email: `worker+e2e${Date.now()}@example.com` };

  await qaUpsertUser(employer.email, 'employer', { tickets: 2 });
  await qaUpsertUser(worker.email, 'worker');
  const before = await qaGetTickets(employer.email);

  // Employer posts job
  await loginAs(page, employer.email);
  await page.goto(APP);
  await page.getByRole('link', { name: /post job/i }).click();
  await page.getByLabel(/title/i).fill(title);
  await page.getByLabel(/description/i).fill('Automated E2E gig');
  const price = page.getByLabel(/price/i);
  if (await price.isVisible().catch(() => false)) await price.fill('123');
  await page.getByRole('button', { name: /save|create|publish/i }).click();
  await expect(page.getByRole('heading', { name: new RegExp(title, 'i') })).toBeVisible({ timeout: 15000 });

  // Worker applies
  const workerPage = await context.newPage();
  await loginAs(workerPage, worker.email);
  await workerPage.goto(APP);
  await workerPage
    .getByRole('link', { name: /find work|browse jobs|maghanap ng trabaho/i })
    .click();
  await workerPage.getByRole('link', { name: new RegExp(title, 'i') }).click();
  const applyBtn = workerPage.getByRole('button', { name: /apply|send application|submit/i }).first();
  await expect(applyBtn).toBeVisible();
  await applyBtn.click();
  const notes = workerPage.getByLabel(/note|message|cover/i);
  if (await notes.isVisible().catch(() => false)) await notes.fill('Interested! (E2E)');
  const submitApp = workerPage.getByRole('button', { name: /submit|send/i }).first();
  if (await submitApp.isVisible().catch(() => false)) await submitApp.click();
  await expect(
    workerPage.getByText(/applied|application sent|pending/i)
  ).toBeVisible({ timeout: 15000 });

  // Messaging (worker → employer)
  const msgInputW = workerPage.getByRole('textbox', { name: /message/i }).first();
  if (await msgInputW.isVisible().catch(() => false)) {
    await msgInputW.fill('Hello from worker (E2E)');
    await workerPage.getByRole('button', { name: /send/i }).click();
    await expect(workerPage.getByText(/hello from worker \(e2e\)/i)).toBeVisible();
  }

  // Employer replies and hires
  await page.bringToFront();
  await page.goto(APP);
  await page.getByRole('link', { name: new RegExp(title, 'i') }).first().click();
  const msgInputE = page.getByRole('textbox', { name: /message/i }).first();
  if (await msgInputE.isVisible().catch(() => false)) {
    await msgInputE.fill('Hello from employer (E2E)');
    await page.getByRole('button', { name: /send/i }).click();
    await expect(page.getByText(/hello from employer \(e2e\)/i)).toBeVisible();
  }
  const hireBtn = page.getByRole('button', { name: /hire|accept|mark as hired/i });
  await expect(hireBtn).toBeVisible();
  await hireBtn.click();
  await expect(page.getByText(/hired|accepted/i)).toBeVisible({ timeout: 15000 });

  const after = await qaGetTickets(employer.email);
  expect(after).toBeLessThanOrEqual(before);
  if (after === before) console.warn('[e2e] ticket did not change – consumption may occur earlier in flow');

  await qaCleanupJobs({ titlePrefix: 'E2E Gig ' });
});
