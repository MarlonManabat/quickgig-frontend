import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_SIZE = 2 * 1024 * 1024;
const TYPES = ["image/png", "image/jpeg"];

export function validateAvatarFile(file: File) {
  return TYPES.includes(file.type) && file.size <= MAX_SIZE;
}

export async function uploadAvatar(
  client: SupabaseClient,
  userId: string,
  file: File,
) {
  const ext = file.type === "image/png" ? "png" : "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await client.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = client.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
