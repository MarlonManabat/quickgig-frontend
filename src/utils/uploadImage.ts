import { supabase } from "@/utils/supabaseClient";
export async function uploadImage(bucket: string, userId: string, file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
  if (error) throw error;
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { path: data.path, publicUrl: pub.publicUrl };
}
