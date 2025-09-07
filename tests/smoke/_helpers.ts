import { expect, Page } from '@playwright/test';

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeLoginRe(dest: string | RegExp) {
  if (typeof dest === 'string') {
    // exact encoded "next" for string destinations
    return new RegExp(`/login\\?next=${escapeRe(encodeURIComponent(dest))}$`);
  }
  // For RegExp destinations, derive a literal-ish path, encode it,
  // and match it as a substring inside the next= query.
  const literal = dest.source
    .replace(/^\^?/, '')
    .replace(/\$?\/?$/, '')
    .replace(/\\\//g, '/')
    .replace(/\(\?:.*?\)\??/g, '')
    .replace(/\.\*/g, '');
  const enc = encodeURIComponent(literal);
  return new RegExp(`/login\\?next=[^#]*${escapeRe(enc)}[^#]*$`);
}

export async function expectAuthAwareRedirect(page: Page, dest: string | RegExp, timeout = 8000) {
  const loginRe = makeLoginRe(dest);
  const destRe =
    typeof dest === 'string'
      ? new RegExp(`${escapeRe(dest).replace(/\\\//g, '\\/')}\\/?$`)
      : dest;

  // Accept either reaching the destination or being redirected to login with ?next=<dest>
  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${loginRe.source}|${destRe.source}`));
}

// Safer mobile menu opener (keeps if identical)
export async function openMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button');
  await btn.waitFor({ state: 'visible', timeout: 2000 });
  await btn.click();
}
