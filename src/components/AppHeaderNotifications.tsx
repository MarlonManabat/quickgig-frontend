'use client';

import React from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { safeSelect } from '@/lib/supabase-safe';

type NotificationRow = {
  id: string;
  title: string;
  link: string | null;
  read: boolean;
  created_at: string;
  user_id?: string;
};

export default function AppHeaderNotifications() {
  const supa = getSupabaseBrowser();
  const [items, setItems] = React.useState<NotificationRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { user } } = await supa.auth.getUser();
      const uid = user?.id;
      if (!uid) { if (mounted) setItems([]); setLoading(false); return; }

      const list = await safeSelect<NotificationRow[]>(
        supa
          .from('notifications')
          .select('id,title,link,read,created_at')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(5)
      );

      if (mounted) {
        setItems(Array.isArray(list) ? list : []);
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [supa]);

  // Render a minimal non-fatal UI
  if (loading) return null;
  if (!items.length) return null;

  return (
    <div className="relative">
      {/* Your bell icon / dropdown here; keep it simple to avoid SSR issues */}
      <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow">
        <ul className="p-2">
          {items.map(n => (
            <li key={n.id} className="py-2 px-3 hover:bg-gray-50 rounded-lg">
              <a href={n.link || '#'} className="block text-sm">
                <span className="font-medium">{n.title}</span>
                <span className="block text-xs opacity-60">{new Date(n.created_at).toLocaleString()}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
