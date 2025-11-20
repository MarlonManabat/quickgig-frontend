import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon) return null;

  const cookieStore = cookies();

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options?: any) {
        cookieStore.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
    headers: {
      get(name: string) {
        return headers().get(name) ?? undefined;
      },
    },
  });
}

export const supabaseServer = getServerSupabase;

export function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createServerClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function publicSupabase() {
  return getServerSupabase();
}

export async function userIdFromCookie() {
  const supa = getServerSupabase();
  if (!supa) return null;
  const { data } = await supa.auth.getUser();
  return data.user?.id ?? null;
}

export default getServerSupabase;
