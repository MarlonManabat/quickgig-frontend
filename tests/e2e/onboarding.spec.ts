import { test, expect } from '@playwright/test';
import { stubSignIn, getDemoEmail } from '../utils/session';
import { createClient } from '@supabase/supabase-js';

const app = process.env.PLAYWRIGHT_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@full user onboarding creates/updates profile', async ({ page }) => {
  const email = getDemoEmail();
  if (qa) await stubSignIn(page, email);
  const display = `QA User ${Date.now()}`;
  await page.goto(`${app}/profile`, { waitUntil: 'load' });
  await page.getByTestId('profile-first-name').fill(display);
  await page.getByTestId('profile-save').click();
  await expect(page.getByText(/na-save|saved/i)).toBeVisible();

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('email', email)
    .single();
  expect(data?.first_name).toBe(display);
});
