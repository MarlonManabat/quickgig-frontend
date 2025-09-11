import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

/**
 * Server-only Supabase client bound to request cookies.
 * Use from App Router route handlers, server components, or server actions.
 */
export function getServerSupabase() {
  const cookieStore = cookies();
  const headerStore = headers();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createServerClient(url, anon, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) =>
        cookieStore.set({ name, value, ...options }),
      remove: (name: string, options: any) =>
        cookieStore.set({ name, value: "", ...options }),
    },
    headers: {
      get: (key: string) => headerStore.get(key) ?? undefined,
    } as any,
  });
}

/** Admin PostgREST client for RPCs that must bypass RLS */
export async function getAdminClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, service, { auth: { persistSession: false } });
}

// Back-compat
export const supabaseServer = getServerSupabase;
export default getServerSupabase;
