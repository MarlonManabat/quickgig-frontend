import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

/** Never construct Supabase during build/SSR; return null instead. */
export function getSupabaseBrowser() {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null; // tolerate missing env in CI
  return createPagesBrowserClient({ supabaseUrl: url, supabaseKey: key } as any);
}
