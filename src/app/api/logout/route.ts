import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, NEXT_COOKIE } from "@/lib/constants";

function resolveNext(req: NextRequest): URL {
  const { origin } = req.nextUrl;
  const target = req.nextUrl.searchParams.get("next") ?? "/";
  let url: URL;
  try {
    url = new URL(target, origin);
  } catch {
    url = new URL("/", origin);
  }
  if (url.origin !== origin) {
    return new URL("/", origin);
  }
  return url;
}

export async function GET(req: NextRequest) {
  const redirectTo = resolveNext(req);
  const res = NextResponse.redirect(redirectTo);
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
  [AUTH_COOKIE, "sb-access-token", "sb-refresh-token", NEXT_COOKIE].forEach(
    (name) => {
      res.cookies.set({
        name,
        value: "",
        ...base,
      });
    },
  );
  return res;
}
