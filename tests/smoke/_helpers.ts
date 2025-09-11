import { expect, Locator, Page } from '@playwright/test';

export function expectHref(loc: Locator, re: RegExp) {
  return expect(async () => {
    const href = await loc.getAttribute('href');
    expect(href, `href was ${href}`).toMatch(re);
  }).toPass();
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function rePath(dest: string): RegExp {
  // Accept <dest> with optional query/hash
  return new RegExp(`^${esc(dest)}(?:[?#].*)?$`);
}

export function reAuthAware(dest: string): RegExp {
  // Accept /login?next=<dest> OR <dest> (optional query/hash)
  const enc = encodeURIComponent(dest);
  return new RegExp(`^(?:/login\\?next=${enc}(?:[&#].*)?|${esc(dest)}(?:[?#].*)?)$`);
}

export async function expectAuthAwareHref(page: Page, testId: string, dest: string) {
  const loc = page.getByTestId(testId).first();
  await expectHref(loc, reAuthAware(dest));
}
