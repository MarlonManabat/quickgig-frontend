import { expect, Page } from '@playwright/test';

export async function expectAuthAwareRedirect(
  page: Page,
  dest: string | RegExp,
  timeout = 8000
) {
  // Accept any login redirect that carries a next= value.
  const loginRe = /\/login\?next=.*/;

  const destRe =
    typeof dest === 'string'
      ? new RegExp(`${dest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
      : dest;

  // Poll the *full URL* and match using a combined regex. No anchors -> matches absolute URLs too.
  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${loginRe.source}|${destRe.source}`));
}

