import { expect, Page } from '@playwright/test';

export async function expectAuthAwareRedirect(
  page: Page,
  dest: string | RegExp,
  timeout = 8000
) {
  const encoded = encodeURIComponent(
    typeof dest === 'string' ? dest : '/__regex__/'
  );
  const loginRe = new RegExp(`/login\\?next=${encoded}$`);
  const destRe =
    typeof dest === 'string' ? new RegExp(`${dest.replace(/\\/g, '\\\\')}$`) : dest;

  await expect
    .poll(async () => page.url(), { timeout })
    .toMatch(new RegExp(`${loginRe.source}|${destRe.source}`));
}

export async function openMenu(page: Page) {
  const btn = page.getByTestId('nav-menu-button');
  if (!(await btn.isVisible())) {
    await page.setViewportSize({ width: 390, height: 844 });
  }
  await expect(btn).toBeVisible({ timeout: 5000 });
  const expanded = await btn.getAttribute('aria-expanded');
  if (expanded !== 'true') {
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
  }
}
