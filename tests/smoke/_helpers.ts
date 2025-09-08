import { expect, Page } from '@playwright/test';

export async function expectAuthAwareRedirect(
  page: Page,
  dest: string | RegExp,
  timeout = 8000,
) {
  const enc = typeof dest === 'string' ? encodeURIComponent(dest) : '__regex__';
  // Allow a hop through PKCE start OR the final destination
  const pkceStart = /\/api\/auth\/pkce\/start$/;
  const loginRe = new RegExp(`/login\?next=${enc}$`);
  const destRe =
    typeof dest === 'string'
      ? new RegExp(`${dest.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}$`)
      : dest;
  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${pkceStart.source}|${loginRe.source}|${destRe.source}`));
}

