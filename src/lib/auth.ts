"use client";
export const isAdmin = (email?: string) =>
  (process.env.ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .includes((email || "").toLowerCase());

import { getSupabaseBrowser } from "@/lib/supabase/client";

export async function sendMagicLink(
  email: string,
  params?: { next?: string; role?: string },
) {
  const supabase = getSupabaseBrowser();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://app.quickgig.ph";
  const qp = new URLSearchParams();
  if (params?.next) qp.set("next", params.next);
  if (params?.role) qp.set("role", params.role);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/api/auth/callback${
        qp.toString() ? `?${qp.toString()}` : "?next=/"
      }`,
    },
  });
  return { error };
}
