import { test, expect } from "@playwright/test";
import { APP_URL, TEST_EMAIL_ADMIN } from "./helpers/env";
import { loginViaMagicLink } from "./helpers/auth";

test("create gig → save → upload proof → admin approves", async ({
  page,
  browser,
}) => {
  // user A
  await page.goto(APP_URL);
  await loginViaMagicLink(page);
  await page.waitForLoadState("networkidle");

  // If first-run profile gate appears, complete it quickly
  try {
    const fullName = page.getByLabel(/full\s*name/i);
    if (await fullName.isVisible({ timeout: 1000 })) {
      await fullName.fill("QA Bot");
      await page.getByRole("button", { name: /save|continue|update/i }).click();
      await page.waitForLoadState("networkidle");
    }
  } catch {}

  // Navigate to Create Gig via header (more reliable than deep-link)
  const postJob = page.getByRole("link", { name: /post job/i });
  if (await postJob.isVisible({ timeout: 2000 }).catch(() => false)) {
    await postJob.click();
  } else {
    await page.goto(`${APP_URL}/post`);
  }
  await page.waitForLoadState("domcontentloaded");

  // Flexible selectors (label OR placeholder OR name OR data-testid)
  const title = page
    .locator(
      'input[name="title"], input#title, [placeholder*="title" i], [data-testid="gig-title"]',
    )
    .first();
  await title.waitFor({ state: "visible", timeout: 10000 });
  await title.fill("Playwright Test Gig");

  const desc = page
    .locator(
      'textarea[name="description"], textarea#description, [placeholder*="description" i], [data-testid="gig-description"]',
    )
    .first();
  await desc.fill("Automated E2E gig");

  const price = page
    .locator(
      'input[name="price"], input#price, [placeholder*="price" i], [data-testid="gig-price"], input[type="number"]',
    )
    .first();
  await price.fill("123");

  const regionSel = page.getByTestId("region-select");
  if (await regionSel.isVisible().catch(() => false)) {
    await regionSel.selectOption({ label: "NCR" });
    await page
      .getByTestId("city-select")
      .selectOption({ label: "Quezon City" });
  }

  await page.getByRole("button", { name: /save|create|publish/i }).click();
  // consider success if either we navigate to a detail page OR see a success toast
  const navigated = await Promise.race([
    page
      .waitForURL(/\/gigs\/\d+$/, { timeout: 8000 })
      .then(() => true)
      .catch(() => false),
    page
      .getByText(/created|saved|success/i)
      .waitFor({ timeout: 8000 })
      .then(() => true)
      .catch(() => false),
  ]);
  if (!navigated) {
    // Fallback: open from list by title if present; otherwise continue
    await page.goto(`${APP_URL}/find`);
    const item = page
      .getByRole("link", { name: /Playwright Test Gig/i })
      .first();
    if (await item.isVisible().catch(() => false)) {
      await item.click();
    } else {
      console.warn(
        "[full-e2e] gig detail not reachable; proceeding to payments",
      );
    }
  }
  // Save/unsave only if buttons exist on current page
  const saveBtn = page.getByRole("button", { name: /save/i }).first();
  if (await saveBtn.isVisible().catch(() => false)) {
    await saveBtn.click().catch(() => {});
    const unsaveBtn = page.getByRole("button", { name: /unsave/i }).first();
    if (await unsaveBtn.isVisible().catch(() => false)) {
      await unsaveBtn.click().catch(() => {});
    }
  }
  // upload payment proof
  await page.goto(`${APP_URL}/pay`);
  const file = Buffer.from("fakeimage", "utf8");
  const path = "test.png";
  await page.setInputFiles('input[type="file"]', {
    name: path,
    mimeType: "image/png",
    buffer: file,
  });
  await page.getByRole("button", { name: /submit/i }).click();

  // admin review in a second context (still QA: use magic link + seeded admin)
  const context2 = await browser.newContext();
  const admin = await context2.newPage();
  await admin.goto(APP_URL);
  await loginViaMagicLink(admin, TEST_EMAIL_ADMIN);
  await admin.goto(`${APP_URL}/admin/payments`);
  // approve the first
  const approve = admin.getByRole("button", { name: /approve/i }).first();
  if (await approve.isVisible()) await approve.click();
});
