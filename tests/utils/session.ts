import { Page } from "@playwright/test";
import { loginViaMagicLink } from "../helpers/auth";
import { testLogin } from "../helpers/testLogin";

type Kind = "user" | "admin";

/** Returns a demo email for the given kind, or null if not available. */
export function getDemoEmail(kind: Kind = "user"): string | null {
  return (
    kind === "admin" ? process.env.DEMO_ADMIN_EMAIL : process.env.DEMO_USER_EMAIL
  ) ?? null;
}

/** Preview/dev auth: hit test login endpoint to set mock session */
export async function stubSignIn(page: Page, email = getDemoEmail()) {
  const role =
    email?.includes("employer") || email?.includes("admin")
      ? "employer"
      : "worker";
  await testLogin(page, role as any);
}

/** Log in using either QA stub or magic link helper */
export async function loginAs(page: Page, email: string) {
  if (process.env.TEST_LOGIN_ENABLED === "true") {
    await stubSignIn(page, email);
  } else {
    await loginViaMagicLink(page, email);
  }
}
