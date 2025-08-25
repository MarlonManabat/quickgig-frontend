import { test, expect } from '@playwright/test';
import { stubSignIn, getDemoEmail } from '../utils/session';
import { createClient } from '@supabase/supabase-js';
import { disableAnimations } from '../utils/test-login';

const app = process.env.NEXT_PUBLIC_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@full user onboarding creates/updates profile', async ({ page }) => {
  await disableAnimations(page);
  const email = getDemoEmail();
  if (qa) await stubSignIn(page, email);
  const display = `QA User ${Date.now()}`;
  await page.goto(`${app}/profile`);
  await page.waitForLoadState('networkidle');
  await page.getByLabel(/Buong pangalan|Full name/i).fill(display);
  const save = page.getByRole('button', { name: /save|i-save/i });
  await Promise.all([
    page.waitForLoadState('networkidle'),
    save.click(),
  ]);
  await expect(page.getByText(/na-save|saved/i)).toBeVisible();

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('email', email)
    .single();
  expect(data?.full_name).toBe(display);
});
