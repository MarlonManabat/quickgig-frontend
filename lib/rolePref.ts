import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Update } from "@/types/db";

export type RolePref = "worker" | "employer";

export async function getRolePref(userId?: string): Promise<RolePref | null> {
  try {
    if (!userId) {
      // client-only fallback
      if (typeof window !== "undefined") {
        const v = window.localStorage.getItem("role_pref");
        return v === "worker" || v === "employer" ? v : null;
      }
      return null;
    }
    const supabase = createClientComponentClient<Database>();
    // try DB first
    const { data } = await supabase
      .from("profiles")
      .select("role_pref")
      .eq("id", userId)
      .maybeSingle();
    if (data?.role_pref) return data.role_pref as RolePref;
    // fallback to localStorage (client only)
    if (typeof window !== "undefined") {
      const v = window.localStorage.getItem("role_pref");
      return v === "worker" || v === "employer" ? v : null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setRolePref(value: RolePref, userId?: string) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("role_pref", value);
    }
    if (userId) {
      const supabase = createClientComponentClient<Database>();
      await supabase
        .from("profiles")
        .update({ role_pref: value } as Update<"profiles">)
        .eq("id", userId);
    }
  } catch {
    // ignore
  }
}
