import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

export function getSupabaseForGSSP(ctx: GetServerSidePropsContext): SupabaseClient | null {
  const ok =
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!ok) return null;
  return createPagesServerClient(ctx);
}

export function getSupabaseForApi(
  req: NextApiRequest,
  res: NextApiResponse
): SupabaseClient | null {
  const ok =
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!ok) return null;
  return createPagesServerClient({ req, res });
}
