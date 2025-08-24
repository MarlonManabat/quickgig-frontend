import { supabase } from "@/lib/supabaseClient";

export async function uploadAvatar(file: File): Promise<string> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error("Not authenticated");

  const path = `${auth.user.id}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const publicUrl = pub?.publicUrl;
  if (!publicUrl) throw new Error("Could not resolve avatar URL");

  const { error: upProfileErr } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", auth.user.id);
  if (upProfileErr) throw upProfileErr;

  return publicUrl;
}
