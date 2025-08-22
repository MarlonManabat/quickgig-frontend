import { supabase } from './supabaseClient';

export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getProfile() {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, can_post_job, avatar_url')
    .eq('id', id)
    .maybeSingle();
  return profile;
}
