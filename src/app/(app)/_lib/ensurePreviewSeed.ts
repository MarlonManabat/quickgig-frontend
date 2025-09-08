import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function ensurePreviewSeed() {
  if (process.env.VERCEL_ENV === 'production' && process.env.SEED_PREVIEW !== '1') {
    return;
  }
  try {
    await supabaseAdmin.from('jobs').upsert(
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
