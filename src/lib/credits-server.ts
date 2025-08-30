import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export async function getServerSupabase() {
  const { cookies, headers } = require('next/headers') as typeof import('next/headers');
  const cookieStore = cookies();
  return createPagesServerClient(
    { cookies: () => cookieStore, headers } as any,
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );
}
