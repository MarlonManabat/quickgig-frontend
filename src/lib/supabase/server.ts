'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const service = requireEnv('SUPABASE_SERVICE_ROLE');

export async function publicSupabase() {
  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  });
}

export async function adminSupabase() {
  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function userIdFromCookie() {
  const supa = await publicSupabase();
  const { data } = await supa.auth.getUser();
  return data.user?.id ?? null;
}
