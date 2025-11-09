export const isAdmin = (email?: string) =>
  (process.env.ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .includes((email || "").toLowerCase());

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from "@/types/db";

const supabaseBrowser = () => createClientComponentClient<Database>();

export async function sendMagicLink(
  email: string,
  params?: { next?: string; role?: string },
) {
  const supabase = supabaseBrowser();
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
