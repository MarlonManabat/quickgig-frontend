import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

export function getServerSupabase() {
  const cookieStore = cookies();
  const h = headers();
  // headers is referenced for auth-helpers context; no need to pass explicitly with pages client
  return createPagesServerClient(
    { cookies: () => cookieStore, headers: () => h } as any,
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );
}
