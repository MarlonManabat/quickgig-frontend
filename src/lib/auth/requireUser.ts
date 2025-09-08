import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getServerSupabase as getSupabaseServer } from "@/lib/supabase/server";

/**
 * requireUser
 * Server-side guard. If no authenticated user, redirects to /login with ?next=.
 * Pass the intended post-login path (defaults to "/").
 */
export async function requireUser(nextPath: string = "/"): Promise<{ user: User }> {
  const supabase = getSupabaseServer?.();
  // If Supabase isn't configured (preview/mock), treat as unauthenticated.
  if (!supabase) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  try {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user as User | null;
    if (error || !user) {
      redirect(`/login?next=${encodeURIComponent(nextPath)}`);
    }
    return { user };
  } catch {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
}

