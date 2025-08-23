import { Page } from '@playwright/test';
import { readFileSync } from 'fs';

export function getDemoEmail(kind: 'user' | 'admin' = 'user') {
  const json = JSON.parse(readFileSync('test-results/demo-session.json', 'utf-8'));
  return kind === 'admin' ? json.admin : json.user;
}

/**
 * Dev-only auth: if QA_TEST_MODE=true, set a test email for app to pick up.
 * Your app shell should read localStorage.TEST_SESSION_EMAIL and create/use a session for it (dev only).
 */
export async function stubSignIn(page: Page, email = getDemoEmail()) {
  await page.addInitScript(([e]) => localStorage.setItem('TEST_SESSION_EMAIL', e), [email]);
}
