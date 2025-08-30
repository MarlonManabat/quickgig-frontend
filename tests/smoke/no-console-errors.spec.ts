import { test, expect } from "@playwright/test";
import { silenceNonErrors } from "../helpers/env";

test("Landing renders without console errors", async ({ page }) => {
  let hasError = false;
  page.on("console", (msg) => {
    if (msg.type() === "error") hasError = true;
  });
  await page.goto("/");
  expect(hasError).toBeFalsy();
});
