import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { getTestSession } from './testSession';

export async function getServerSupabase() {
  const { cookies, headers } = require('next/headers') as typeof import('next/headers');
  const cookieStore = cookies();
  const client = createPagesServerClient(
    { cookies: () => cookieStore, headers } as any,
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );

  const test = getTestSession();
  if (test.isTest) {
    client.auth.getUser = async () => ({
      data: { user: { id: test.user.id, email: `${test.user.role}@test.com` } },
      error: null,
    }) as any;
  }

  return client;
}
