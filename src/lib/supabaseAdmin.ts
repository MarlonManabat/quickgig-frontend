import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!, // server only
  { auth: { persistSession: false } }
);
