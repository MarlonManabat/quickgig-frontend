import { supabase } from '@/lib/supabaseClient';

export async function markThreadRead(appId: string, userId: string) {
  const { error } = await supabase
    .from('message_reads')
    .upsert(
      { app_id: appId, user_id: userId, last_read_at: new Date().toISOString() },
      { onConflict: 'app_id,user_id' }
    );
  if (error) throw error;
}

export async function getUnreadCount(appId: string, userId: string) {
  const { data: mr } = await supabase
    .from('message_reads')
    .select('last_read_at')
    .eq('app_id', appId)
    .eq('user_id', userId)
    .single();

  const since = mr?.last_read_at ?? '1970-01-01T00:00:00Z';

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('application_id', appId)
    .gt('created_at', since)
    .neq('sender', userId);

  return count ?? 0;
}
