import { Page } from '@playwright/test';

/**
 * Dev-only auth: if QA_TEST_MODE=true, set a test email for app to pick up.
 * Your app shell should read localStorage.TEST_SESSION_EMAIL and create/use a session for it (dev only).
 */
export async function stubSignIn(page: Page, email = 'demo-user@quickgig.test') {
  await page.addInitScript(([e]) => localStorage.setItem('TEST_SESSION_EMAIL', e), [email]);
}
