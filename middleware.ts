import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Ensure middleware runs on Node runtime (not Edge) so anything that
// indirectly touches Supabase helpers won’t crash during build or preview.
export const runtime = "nodejs";

const PUBLIC_ALLOW = new Set([
  "/",
  "/home",
  "/find",
  "/post",
  "/start",
  "/onboarding/role",
  "/login",
  "/signup",
  "/profile", // /profile allowed; page enforces completeness itself
]);

function isAssetOrApi(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  if (isAssetOrApi(pathname)) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1) Logged-out → never force redirects (no loops)
  if (!user) return res;

  // 2) Read profile server-side (role + basic completeness fields)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_pref, first_name, city, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role_pref ?? null) as "worker" | "employer" | null;
  const profileIncomplete = !profile || !profile.first_name || !profile.city;

  // 3) Never redirect from public allowlist (prevents /home loops)
  if (PUBLIC_ALLOW.has(pathname)) {
    return res;
  }

  // 4) Profile incomplete? Allow only public allowlist and /profile; redirect others to /profile
  if (profileIncomplete && pathname !== "/profile") {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    // preserve original target so profile can send them back
    const original = req.nextUrl.pathname + (req.nextUrl.search ?? "");
    url.search = `?next=${encodeURIComponent(original)}`;
    return NextResponse.redirect(url);
  }

  // 5) No role yet: allow them to reach /onboarding/role; block dashboards
  if (!role) {
    if (pathname.startsWith("/dashboard/")) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding/role";
      return NextResponse.redirect(url);
    }
    return res;
  }

  // 6) Normalize dashboards to the correct one (single redirect)
  if (pathname.startsWith("/dashboard/")) {
    const desired =
      role === "worker" ? "/dashboard/worker" : "/dashboard/employer";
    if (pathname !== desired) {
      const url = req.nextUrl.clone();
      url.pathname = desired;
      return NextResponse.redirect(url);
    }
  }

  // 7) Default: no redirect
  return res;
}

export const config = {
  matcher: ["/((?!.*\\.).*)"], // all pages without file extension
};
