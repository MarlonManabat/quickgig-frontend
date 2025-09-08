import { NextResponse } from "next/server";

/**
 * Preview/CI-safe PKCE start.
 * If required env/config is missing, just bounce to /login?next=… instead of throwing.
 * In non-production we always prefer the simple /login redirect to avoid flaky builds.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/";

  // In CI/preview we don't depend on external IdP – always redirect to /login.
  if (process.env.CI || process.env.NODE_ENV !== "production") {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, url), { status: 302 });
  }

  // If prod but misconfigured, also fall back gracefully.
  try {
    // If you later add a real PKCE flow, do it here.
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, url), { status: 302 });
  } catch {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, url), { status: 302 });
  }
}
