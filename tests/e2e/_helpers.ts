import { expect, Page } from '@playwright/test';

export function escapeForRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toDestRegex(dest: string | RegExp): RegExp {
  if (typeof dest === 'string') {
    const path = dest.endsWith('/') ? dest.slice(0, -1) : dest;
    return new RegExp(`${escapeForRegex(path)}\\/?$`);
  }
  return dest;
}

export async function expectAuthAwareRedirect(page: Page, dest: string | RegExp) {
  const destRe = toDestRegex(dest);

  try {
    await expect(page).toHaveURL(destRe, { timeout: 8000 });
    return;
  } catch {
    // Fall through to login?next=<encoded>
  }

  const path = typeof dest === 'string'
    ? dest
    : `/${(dest as RegExp).source.replace(/^\\/?/, '').replace(/\\\/?\$$/, '')}`;

  const encoded = encodeURIComponent(path);
  const loginNext = new RegExp(`/login\\?next=${encoded}`);
  await expect(page).toHaveURL(loginNext, { timeout: 8000 });
}

export const Routes = {
  browse: /\/browse-jobs\/?$/,
  post: /\/gigs\/create\/?$/,
  apps: /\/applications\/?$/,
  login: /\/login\/?$/,
};
