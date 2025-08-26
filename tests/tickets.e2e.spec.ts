import { test, expect } from "@playwright/test";
import { loginViaMagicLink } from "./helpers/auth"; // existing helper

const EMPLOYER = process.env.QA_TEST_EMAIL!;
const WORKER =
  process.env.QA_TEST_EMAIL_ALT || "worker+" + Date.now() + "@example.com";

test.setTimeout(120_000);

test.describe("[full-e2e] tickets gate hire", () => {
  test("hire blocked without tickets, succeeds after credit", async ({
    request,
    page,
  }) => {
    // Seed scenario
    const seed = await request.post("/api/qa/seed-hire-scenario", {
      data: { employerEmail: EMPLOYER, workerEmail: WORKER },
    });
    const data = await seed.json();
    expect(data.ok).toBeTruthy();

    // Employer logs in and tries to hire
    await loginViaMagicLink(page, EMPLOYER);
    await page.goto(
      `${process.env.APP_URL}/applications/${data.applicationId}`,
    );
    await page.getByRole("button", { name: /hire|accept|confirm/i }).click();

    // Expect blocked: either redirect to /pay or see a "out of tickets" toast
    const blocked = await Promise.race([
      page
        .waitForURL(/\/pay/i, { timeout: 6000 })
        .then(() => true)
        .catch(() => false),
      page
        .getByText(/out of tickets|add tickets/i)
        .waitFor({ timeout: 6000 })
        .then(() => true)
        .catch(() => false),
    ]);
    expect(blocked).toBeTruthy();

    // Credit tickets via QA endpoint
    await request.post("/api/qa/credit-tickets", {
      data: { userId: data.employerId, tickets: 3 },
    });

    // Retry hire → should succeed (URL changes or status label shows)
    await page.goto(
      `${process.env.APP_URL}/applications/${data.applicationId}`,
    );
    await page.getByRole("button", { name: /hire|accept|confirm/i }).click();

    const success = await Promise.race([
      page
        .getByText(/hired|accepted|confirmed/i)
        .waitFor({ timeout: 8000 })
        .then(() => true)
        .catch(() => false),
      page
        .waitForURL(new RegExp(`/applications/${data.applicationId}(?!$)`), {
          timeout: 8000,
        })
        .then(() => true)
        .catch(() => false),
    ]);
    expect(success).toBeTruthy();
  });
});
