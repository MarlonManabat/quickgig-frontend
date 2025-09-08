import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "qg_next";
const DOMAIN = ".quickgig.ph";
const APP = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://app.quickgig.ph";

function sanitizePath(raw?: string | null): string {
  try {
    if (!raw) return "/applications";
    const url = new URL(raw, "https://quickgig.ph");
    return url.pathname.startsWith("/") ? url.pathname : "/applications";
  } catch {
    return "/applications";
  }
}

export default function Page({ searchParams }: { searchParams?: { next?: string } }) {
  const referer = headers().get("referer");
  const desired = searchParams?.next || (referer && new URL(referer).pathname) || "/applications";
  const next = sanitizePath(desired);

  cookies().set(COOKIE, next, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 600, domain: DOMAIN });
  redirect(`${APP}/api/auth/pkce/start?mode=signup`);
}
