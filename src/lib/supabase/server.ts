import 'server-only';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/db';

export function getServerSupabase() {
  const cookieStore = cookies();
  const url = process.env.SUPABASE_URL!;
  const anon = process.env.SUPABASE_ANON_KEY!;
  if (!url || !anon) throw new Error('SUPABASE_URL/ANON key missing');

  return createServerClient<Database>(url, anon, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set() {},
      remove() {},
    },
  });
}

export async function adminSupabase() {
  const url = process.env.SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE;

  if (!url || !service) return null;

  return createClient<Database>(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function publicSupabase() {
  try {
    return getServerSupabase();
  } catch {
    return null;
  }
}

export async function userIdFromCookie() {
  const supa = await publicSupabase();
  if (!supa) return null;
  const { data } = await supa.auth.getUser();
  return data.user?.id ?? null;
}

