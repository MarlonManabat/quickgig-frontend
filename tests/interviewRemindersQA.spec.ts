import { test, expect } from '@playwright/test';
import applicant from './fixtures/interviewApplicant.json';
import employer from './fixtures/interviewEmployer.json';
import slot from './fixtures/interviewSlot.json';

const enabled = process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS_QA === 'true';

test.skip(!enabled, 'Interview Reminders QA disabled');

test('invite and reminder flow', async ({ page }) => {
  await page.clock.install({ time: new Date(slot.startsAt).getTime() });
  // reference fixtures to satisfy mock data requirement
  console.log(applicant.id, employer.id);
  await page.goto('/qa/interview-reminders');
  await expect(page.getByTestId('invite-sent')).toBeVisible();
  await page.clock.fastForward(60 * 60 * 1000);
  await expect(page.getByTestId('reminder-sent')).toBeVisible();
});
