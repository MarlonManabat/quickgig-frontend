import { test, expect } from "@playwright/test";
import { loginAs } from "./_helpers/session";
import { createClient } from "@supabase/supabase-js";

const app = process.env.PLAYWRIGHT_APP_URL!;

test("@full user onboarding creates/updates profile", async ({ page }) => {
  const email = "demo-user@quickgig.test";
  await loginAs(page, 'worker');
  const display = `QA User ${Date.now()}`;
  await page.goto(`${app}/profile`, { waitUntil: "load" });
  await page.getByLabel(/Buong pangalan|Full name/i).fill(display);
  await page.getByRole("button", { name: /save|i-save/i }).click();
  await expect(page.getByText(/na-save|saved/i)).toBeVisible();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("email", email)
    .single();
  expect(data?.full_name).toBe(display);
});
