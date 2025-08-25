import { createClient } from '@supabase/supabase-js';

export function assertSeedEnabled(req: any) {
  const token = process.env.TEST_ENABLE_SEED;
  if (!token) throw new Error('seed disabled');
  if (req.headers['x-test-token'] !== token) throw new Error('bad token');
}

export function admin() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}
