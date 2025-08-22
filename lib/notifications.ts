import { supabase } from '@/utils/supabaseClient'

export async function listNotifications(limit = 20) {
  return supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function unreadCount() {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .is('seen_at', null)
  if (error) throw error
  return count ?? 0
}

export async function markAllSeen() {
  const { error } = await supabase
    .from('notifications')
    .update({ seen_at: new Date().toISOString() })
    .is('seen_at', null)
  if (error) throw error
}

export function subscribeNotifications(userId: string, onInsert: (row: any) => void) {
  const ch = supabase
    .channel('notifications-self')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => onInsert(payload.new)
    )
    .subscribe()
  return () => {
    supabase.removeChannel(ch)
  }
}
