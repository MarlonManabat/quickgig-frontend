// src/lib/supabase/server.ts
import { cookies, headers } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/db'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function supabaseServer() {
  const c = cookies()
  const h = headers()
  return createServerClient<Database>(url, anon, {
    cookies: {
      get: (name: string) => c.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) =>
        c.set({ name, value, ...options }),
      remove: (name: string, options: CookieOptions) =>
        c.set({ name, value: '', ...options, maxAge: 0 }),
    },
    headers: {
      get(key: string) {
        return h.get(key) ?? undefined
      },
    },
  })
}

export async function adminSupabase() {
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!service) return null
  return createClient<Database>(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function publicSupabase() {
  try {
    return supabaseServer()
  } catch {
    return null
  }
}

export async function userIdFromCookie() {
  const supa = supabaseServer()
  const { data } = await supa.auth.getUser()
  return data.user?.id ?? null
}

export default supabaseServer

