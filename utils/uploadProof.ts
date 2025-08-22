import { supabase } from '@/utils/supabaseClient';

export async function uploadPaymentProof(userId: string, file: File) {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage.from('payment-proofs').upload(path, file, {
    upsert: false,
    contentType: file.type || 'application/octet-stream'
  });
  if (error) throw error;
  const { data: pub, error: urlErr } = await supabase.storage.from('payment-proofs').getPublicUrl(data.path);
  if (urlErr) throw urlErr;
  return pub.publicUrl;
}
