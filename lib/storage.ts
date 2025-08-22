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
