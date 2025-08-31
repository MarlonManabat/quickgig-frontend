'use server';

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE!;

export function adminSupabase() {
  if (!url || !service) throw new Error('Supabase env missing');
  return createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false }});
}

export function publicSupabase() {
  if (!url || !anon) throw new Error('Supabase env missing');
  return createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false }});
}
