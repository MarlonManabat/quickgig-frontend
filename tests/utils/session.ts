import { Page } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { loginViaMagicLink } from '../helpers/auth';

type Kind = 'user' | 'admin';

function readOptionalJsonFile(): any | null {
  const candidates = [
    join(process.cwd(), 'tests', 'testdata', 'demo-session.json'),
    join(process.cwd(), 'test-results', 'demo-session.json'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        return JSON.parse(readFileSync(p, 'utf-8'));
      } catch {
        /* noop */
      }
    }
  }
  return null;
}

/** Returns a demo email for the given kind, or null if not available. */
export function getDemoEmail(kind: Kind = 'user'): string | null {
  const envEmail =
    (kind === 'admin' ? process.env.DEMO_ADMIN_EMAIL : process.env.DEMO_USER_EMAIL) ??
    null;
  if (envEmail) return envEmail;

  const json = readOptionalJsonFile();
  if (!json) return null;

  return kind === 'admin' ? json.admin ?? null : json.user ?? null;
}

/**
 * Dev-only auth: if QA_TEST_MODE=true, set a test email for app to pick up.
 * Your app shell should read localStorage.TEST_SESSION_EMAIL and create/use a session for it (dev only).
 */
export async function stubSignIn(page: Page, email = getDemoEmail()) {
  await page.addInitScript(([e]) => localStorage.setItem('TEST_SESSION_EMAIL', e), [email]);
}

/** Log in using either QA stub or magic link helper */
export async function loginAs(page: Page, email: string) {
  if (process.env.QA_TEST_MODE === 'true') {
    await stubSignIn(page, email);
  } else {
    await loginViaMagicLink(page, email);
  }
}
