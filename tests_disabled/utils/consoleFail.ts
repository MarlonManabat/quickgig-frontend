import type { Page } from "@playwright/test";

// Attach and fail on any console.error during a test, ignoring known noisy routes
export function failOnConsoleErrors(page: Page) {
  const IGNORE = [/\/auth\/callback/, /\/search\?/, /\/[_]next\/static\//];
  page.on("console", (msg) => {
    const text = msg.text();
    if (IGNORE.some((rx) => rx.test(text))) return;
    if (msg.type() === "error") throw new Error(`Console error: ${text}`);
  });
}
