import { expect, Page } from '@playwright/test';

export async function expectAuthAwareRedirect(
  page: Page,
  dest: string | RegExp,
  timeout = 8000
) {
  const encoded = typeof dest === 'string' ? encodeURIComponent(dest) : '__regex__';
  const loginRe = new RegExp(`/login\\?next=${encoded}$`);
  const destRe = typeof dest === 'string'
    ? new RegExp(`${dest.replace(/[\\/]/g, '\\$&')}$`)
    : dest;

  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${loginRe.source}|${destRe.source}`));
}

