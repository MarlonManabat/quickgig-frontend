import { supabase } from '@/utils/supabaseClient';

export function subscribeToMessages(appId: string, onInsert: (row: any) => void) {
  const channel = supabase
    .channel(`messages-${appId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `application_id=eq.${appId}` },
      (payload) => onInsert(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
