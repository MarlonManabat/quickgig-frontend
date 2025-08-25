import { Page, expect } from '@playwright/test';

export async function testLogin(page: Page, role: 'employer' | 'seeker') {
  const app = process.env.NEXT_PUBLIC_APP_URL!;
  await page.goto(`${app}/api/__test/login?role=${role}`);
  // The test route sets a cookie and redirects to /start (or home) when TEST_LOGIN_ENABLED=true
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('navigation')).toBeVisible();
}

export async function disableAnimations(page: Page) {
  await page.addStyleTag({ content: `
    *,*::before,*::after { transition: none !important; animation: none !important; }
  `});
}
