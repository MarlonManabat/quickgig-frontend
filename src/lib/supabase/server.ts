// src/lib/supabase/server.ts
import { cookies, headers } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/db'

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  const c = cookies()
  const h = headers()
  return createServerClient<Database>(url, anon, {
    cookies: {
      get: (name: string) => c.get(name)?.value,
      set: () => {},
      remove: () => {},
    } as unknown as CookieOptions,
    headers: {
      get(key: string) {
        return h.get(key) ?? undefined
      },
    },
  })
}

export function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!url || !service) return null
  return createClient<Database>(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function publicSupabase() {
  return supabaseServer()
}

export async function userIdFromCookie() {
  const supa = supabaseServer()
  if (!supa) return null
  const { data } = await supa.auth.getUser()
  return data.user?.id ?? null
}

export default supabaseServer

