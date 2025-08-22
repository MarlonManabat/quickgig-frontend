import { Page, expect } from '@playwright/test';

export async function signUpOrLogin(page: Page, email: string, password: string) {
  await page.goto('/auth');
  // Prefer login; if not visible, sign up.
  const loginEmail = page.getByPlaceholder('Email').first();
  const loginPw = page.getByPlaceholder('Password').first();
  if (await loginEmail.isVisible()) {
    await loginEmail.fill(email);
    await loginPw.fill(password);
    await page.getByRole('button', { name: /log in/i }).click();
  } else {
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: /sign up/i }).click();
  }
  // Land on profile or gigs
  await expect(page).toHaveURL(/\/(profile|gigs)/);
}
