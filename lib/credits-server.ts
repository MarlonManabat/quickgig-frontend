import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export async function getServerSupabase() {
  const cookieStore = cookies();
  const hdrs = headers();
  const url =
    hdrs.get('x-forwarded-host') || hdrs.get('host') || 'localhost:3000';
  const proto = hdrs.get('x-forwarded-proto') || 'http';
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => cookieStore.get(k)?.value } }
  );
  const origin = `${proto}://${url}`;
  return { supabase, origin };
}

export async function getSessionAndCredits() {
  const { supabase } = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, credits: 0 } as const;
  const { data } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', user.id)
    .maybeSingle();
  return { user, credits: data?.credits ?? 0 } as const;
}

