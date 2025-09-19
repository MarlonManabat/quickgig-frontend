import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE } from "@/lib/constants";
import { cookieDomainFor } from "@/lib/auth/cookies";

const DEMO_TOKEN = "demo-user";

function resolveNext(req: NextRequest): URL {
  const { origin } = req.nextUrl;
  const target = req.nextUrl.searchParams.get("next") ?? "/my-applications";
  try {
    const dest = new URL(target, origin);
    if (dest.origin === origin) {
      return dest;
    }
  } catch {}
  return new URL("/my-applications", origin);
}

export async function GET(req: NextRequest) {
  const redirectTo = resolveNext(req);
  const res = NextResponse.redirect(redirectTo, { status: 302 });
  const domain = cookieDomainFor(req.nextUrl.hostname);
  res.cookies.set({
    name: AUTH_COOKIE,
    value: DEMO_TOKEN,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    ...(domain ? { domain } : {}),
  });
  return res;
}
