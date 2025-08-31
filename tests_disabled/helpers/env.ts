export function getAppOrigin(): string {
  return (
    process.env.APP_ORIGIN ||
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    "https://app.quickgig.ph"
  ).replace(/\/+$/, "");
}

export function expectedHref(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getAppOrigin()}${p}`;
}

export function silenceNonErrors(page: import("@playwright/test").Page) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      // Let error bubble (test will fail on assertion step)
      return;
    }
    // Ignore 'warning', 'info', 'log' to avoid flaky failures on landing
  });
}

// Backwards-compat exports for existing tests
export const APP_URL = getAppOrigin();
export const TEST_EMAIL = process.env.QA_TEST_EMAIL || "qa+smoke@quickgig.ph";
export const TEST_EMAIL_ADMIN =
  process.env.QA_TEST_EMAIL_ADMIN || TEST_EMAIL;
