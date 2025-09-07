import { Page } from '@playwright/test';

export async function expectAuthAwareRedirect(
  page: Page,
  destPath: string,
  timeout = 8000
): Promise<'login' | 'landed'> {
  const encoded = encodeURIComponent(destPath);
  const loginRe = new RegExp(`/login\\?next=${encoded}$`);
  const escaped = destPath.replace(/\//g, '\\/');
  const destRe = new RegExp(`${escaped}\\/?$`);

  const winner = await Promise.race([
    page.waitForURL(loginRe, { timeout }).then(() => 'login'),
    page.waitForURL(destRe, { timeout }).then(() => 'landed'),
  ]);
  return winner;
}

// Handy helper for mobile nav
export async function openMobileMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button');
  if (await btn.isVisible()) {
    await btn.click();
  }
}
