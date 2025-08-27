import { supabase } from "./supabaseClient";

const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "assets";

export async function uploadPublicFile(file: File, prefix = "gigs") {
  const name = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const path = `${prefix}/${name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProof(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'dat';
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from('gcash-proofs')
    .upload(path, file, {
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });
  if (error) throw error;
  return data.path;
}
