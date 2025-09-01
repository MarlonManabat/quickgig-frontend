import 'server-only';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/db';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

export function getServerSupabase() {
  const key = SERVICE || ANON;
  if (!URL || !key) return null;
  return createClient<Database>(URL, key);
}

export async function adminSupabase() {
  if (!URL || !SERVICE) return null;
  return createClient<Database>(URL, SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function publicSupabase() {
  if (!URL || !ANON) return null;
  const cookieStore = cookies();
  return createServerClient<Database>(URL, ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  });
}

export async function userIdFromCookie() {
  const supa = await publicSupabase();
  if (!supa) return null;
  const { data } = await supa.auth.getUser();
  return data.user?.id ?? null;
}

