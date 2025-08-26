export const isAdmin = (email?: string) =>
  (process.env.ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .includes((email || "").toLowerCase());

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function sendMagicLink(
  email: string,
  params?: { next?: string; role?: string },
) {
  const supabase = createClientComponentClient();
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL!;
  const qp = new URLSearchParams();
  if (params?.next) qp.set("next", params.next);
  if (params?.role) qp.set("role", params.role);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${base}/auth/callback${qp.toString() ? `?${qp.toString()}` : ""}`,
    },
  });
  return { error };
}
