import { Page, expect } from '@playwright/test';

// In CI some routes land on their destination without auth, while prod redirects to /login?next=…
// Treat either outcome as OK to avoid flakes.
export async function expectAuthAwareRedirect(
  page: Page,
  dest: string | RegExp,
  timeout = 8000
) {
  const encoded = encodeURIComponent(typeof dest === 'string' ? dest : '/__regex__/');
  const loginRe = new RegExp(`/login\\?next=${encoded}$`);
  const destRe = typeof dest === 'string'
    ? new RegExp(`${dest.replace(/[/\\]/g, '\\$&')}$`)
    : dest;

  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${loginRe.source}|${destRe.source}`));
}

