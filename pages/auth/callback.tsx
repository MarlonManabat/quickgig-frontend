"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const REDIRECT_GUARD_PAGES = ["/start", "/onboarding", "/profile", "/home"];
const CALLBACK_FLAG = "__qg_auth_redirected";

export default function AuthCallback() {
  const router = useRouter();
  createClientComponentClient();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next =
      params.get("next") ||
      process.env.NEXT_PUBLIC_DEFAULT_REDIRECT ||
      "/start";

    // Skip if we're already on a stable page or we've redirected once.
    if (REDIRECT_GUARD_PAGES.includes(window.location.pathname)) return;
    if (
      REDIRECT_GUARD_PAGES.includes(next) &&
      sessionStorage.getItem(CALLBACK_FLAG)
    )
      return;

    if (REDIRECT_GUARD_PAGES.includes(next)) {
      sessionStorage.setItem(CALLBACK_FLAG, "1");
    }
    const id = setTimeout(() => router.replace(next), 150);
    return () => clearTimeout(id);
  }, [router]);
  return null;
}
