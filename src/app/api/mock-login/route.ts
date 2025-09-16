import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

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
  res.cookies.set({
    name: AUTH_COOKIE,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 2 * 60 * 60,
  });
  return res;
}
