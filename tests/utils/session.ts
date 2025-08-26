import { Page } from "@playwright/test";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { loginViaMagicLink } from "../helpers/auth";
import { testLogin } from "../helpers/testLogin";

type Kind = "user" | "admin";

function readOptionalJsonFile(): any | null {
  const candidates = [
    join(process.cwd(), "tests", "testdata", "demo-session.json"),
    join(process.cwd(), "test-results", "demo-session.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        return JSON.parse(readFileSync(p, "utf-8"));
      } catch {
        /* noop */
      }
    }
  }
  return null;
}

/** Returns a demo email for the given kind, or null if not available. */
export function getDemoEmail(kind: Kind = "user"): string | null {
  const envEmail =
    (kind === "admin"
      ? process.env.DEMO_ADMIN_EMAIL
      : process.env.DEMO_USER_EMAIL) ?? null;
  if (envEmail) return envEmail;

  const json = readOptionalJsonFile();
  if (!json) return null;

  return kind === "admin" ? (json.admin ?? null) : (json.user ?? null);
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
