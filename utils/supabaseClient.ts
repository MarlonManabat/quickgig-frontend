import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton
export const supabase = createClient(url, anon);

// Test auth stub: allow Playwright tests to bypass network auth using a localStorage flag.
// Only enabled when QA_TEST_MODE is true to avoid leaking into production.
if (typeof window !== 'undefined') {
  const qa =
    process.env.NEXT_PUBLIC_QA_TEST_MODE === 'true' ||
    process.env.QA_TEST_MODE === 'true';
  if (qa) {
    const email = window.localStorage.getItem('TEST_SESSION_EMAIL');
    if (email) {
      const ids: Record<string, string> = {
        'demo-user@quickgig.test': '00000000-0000-0000-0000-000000000001',
        'new-user@quickgig.test': '00000000-0000-0000-0000-000000000002',
        'demo-admin@quickgig.test': '00000000-0000-0000-0000-000000000003',
      };
      const user = { id: ids[email] ?? email, email } as any;
      supabase.auth.getUser = async () => ({ data: { user }, error: null });
      supabase.auth.onAuthStateChange = (callback) => {
        callback('SIGNED_IN', { user } as any);
        return { data: { subscription: { unsubscribe() {} } } } as any;
      };
    }
  }
}

export function createServerClient() {
  return createClient(url, anon, { auth: { persistSession: false } });
}
