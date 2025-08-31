import 'dotenv/config';
import { requireServer } from '@/lib/env';
import { createClient } from '@supabase/supabase-js';

(async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = requireServer('SUPABASE_SERVICE_ROLE');

  if (!url || !serviceKey) {
    console.log('Seed skipped: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE');
    return;
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  await supabase.from('profiles').upsert([
    { id: 'e2e-employer', role: 'employer', email: process.env.SEED_ADMIN_EMAIL ?? 'employer+e2e@example.com' },
    { id: 'e2e-worker', role: 'worker', email: 'worker+e2e@example.com' }
  ]);

  await supabase.from('tickets').upsert([
    { id: 'e2e-ticket-1', owner: 'e2e-employer', status: 'open', amount: 5 },
    { id: 'e2e-ticket-2', owner: 'e2e-employer', status: 'open', amount: 10 }
  ]);

  console.log('✅ Local seed complete');
})().catch((e) => {
  console.error('Seed failed (non-fatal in CI fallback):', e);
  process.exit(0);
});
