import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';

export async function ensurePreviewSeed() {
  if (process.env.VERCEL_ENV === 'production' && process.env.SEED_PREVIEW !== '1') {
    return;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !serviceKey) return;
  try {
    const admin = createClient<Database>(url, serviceKey, { auth: { persistSession: false } });
    await admin.from('jobs').upsert(
      {
        id: 'preview-seed-job',
        title: 'Preview seed job',
        description: 'Seed job for previews',
        status: 'published',
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.error('ensurePreviewSeed failed', err);
  }
}
