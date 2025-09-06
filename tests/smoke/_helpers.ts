import { expect, Page } from '@playwright/test';

export async function gotoHome(page: Page) {
  // "/" now redirects; normalize and assert we end on /browse-jobs
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/browse-jobs\/?$/);
}

/**
 * Accepts BOTH outcomes:
 *  - already "authed" or mock -> lands on `path`
 *  - anonymous CI -> redirected to `/login?next=<path>`
 */
export async function expectAuthAwareRedirect(page: Page, path: string, timeout = 8000) {
  const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
  const esc = normalized.replace(/\//g, '\\/');
  const loginRe = new RegExp(`/login\\?next=${esc}\\/?$`.replace(/\?/g, '\\?'));
  const targetRe = new RegExp(`${esc}\\/?$`);
  // Accept either
  await expect(page).toHaveURL(new RegExp(`(${loginRe.source})|(${targetRe.source})`), { timeout });
}

/** Open the mobile nav safely */
export async function openMobileMenu(page: Page) {
  // Ensure a small viewport
  await page.setViewportSize({ width: 390, height: 844 });
  const btn = page.getByTestId('nav-menu-button').first();
  await btn.waitFor({ state: 'attached' });
  // Hydration/layout can delay visibility briefly
  await btn.waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
  if (await btn.isVisible()) await btn.click();
}
