import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

// For getServerSideProps
export function getSupabaseForGSSP(
  ctx: GetServerSidePropsContext
): SupabaseClient | null {
  const hasEnv =
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasEnv) {
    console.warn('[supabase] Missing envs in SSR; returning null');
    return null;
  }
  return createPagesServerClient(ctx);
}

// For API routes (Pages Router)
export function getSupabaseForApi(
  req: NextApiRequest,
  res: NextApiResponse
): SupabaseClient | null {
  const hasEnv =
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasEnv) {
    console.warn('[supabase] Missing envs in API; returning null');
    return null;
  }
  return createPagesServerClient({ req, res });
}
