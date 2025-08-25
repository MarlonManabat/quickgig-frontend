import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

/** Non-null client for API routes (throws if misconfigured at runtime) */
export function requireSupabaseForApi(
  req: NextApiRequest,
  res: NextApiResponse
): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Supabase env missing in API route');
  }
  return createPagesServerClient({ req, res });
}

/** Optional: SSR (GSSP) helper when you want a nullable client */
export function getSupabaseForGSSP(
  ctx: GetServerSidePropsContext
): SupabaseClient | null {
  const ok =
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return ok ? createPagesServerClient(ctx) : null;
}
