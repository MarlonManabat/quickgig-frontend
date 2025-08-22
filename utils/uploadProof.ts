import { supabase } from '@/utils/supabaseClient';

export async function uploadPaymentProof(userId: string, file: File) {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from('payment-proofs')
    .upload(path, file, {
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });
  if (error) throw error;

  // In supabase-js v2 this is synchronous and has no `error`
  const { data: pub } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(data.path);

  // Store a URL the UI can open; keep path in case we switch to signed URLs later
  return { path: data.path, publicUrl: pub.publicUrl };
}
