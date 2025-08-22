import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

type Notification = {
  id: string;
  type: string;
  created_at: string;
  payload: any;
  actor?: { full_name?: string } | null;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, type, created_at, payload, actor:profiles!notifications_actor_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error && (error as any).code === '42P01') {
        const me = (await supabase.auth.getUser()).data.user?.id;
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: msgs } = await supabase
          .from('messages')
          .select('id, sender_id, thread_id, created_at, sender:profiles!messages_sender_id_fkey(full_name)')
          .neq('sender_id', me)
          .gte('created_at', since)
          .order('created_at', { ascending: false })
          .limit(50);
        const derived = (msgs ?? []).map(m => ({
          id: m.id,
          type: 'message',
          created_at: m.created_at,
          payload: m,
          actor: { full_name: (m as any).sender?.full_name },
        }));
        setItems(derived);
      } else if (data) {
        setItems(data as Notification[]);
      }
    })();
  }, []);

  return (
    <ul data-testid="notifications-list" className="p-4 space-y-2">
      {items.map(n => (
        <li key={n.id}>New message from {n.actor?.full_name ?? 'someone'}</li>
      ))}
    </ul>
  );
}

