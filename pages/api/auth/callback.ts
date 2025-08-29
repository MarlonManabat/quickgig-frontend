import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res }, {
    cookieOptions: {
      domain: process.env.SUPABASE_AUTH_COOKIE_DOMAIN || undefined
    }
  });

  // Exchange the code from the magic link for a session cookie
  const { error } = await supabase.auth.exchangeCodeForSession(req.url!);
  if (error) {
    return res.redirect(`/auth/error?m=${encodeURIComponent(error.message)}`);
  }

  // Optional next param
  const next = (req.query.next as string) || '/';
  return res.redirect(next);
}
